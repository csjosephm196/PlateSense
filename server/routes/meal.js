import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Session from '../models/Session.js';
import Meal from '../models/Meal.js';
import { authMiddleware } from '../middleware/auth.js';
import { getIo } from '../services/socket.js';
import { analyzeFoodImage, predictGlucoseImpact } from '../services/gemini.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/upload-meal-image', upload.single('image'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId || !req.file) return res.status(400).json({ error: 'sessionId and image required' });
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Invalid or expired session' });
    if (session.expiresAt < new Date()) return res.status(410).json({ error: 'Session expired' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const io = getIo();
    if (io) io.to(sessionId).emit('meal-image-uploaded', { imageUrl, filename: req.file.filename });
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/analyze-meal', authMiddleware, async (req, res) => {
  try {
    const { imageUrl, current_glucose } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const fullPath = path.join(uploadDir, path.basename(imageUrl));
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Image not found' });
    const stage1 = await analyzeFoodImage(fullPath);
    const user = req.user;
    const stage2 = await predictGlucoseImpact({
      total_carbs: stage1.total_estimated_carbs_g,
      diabetes_type: user.diabetes_type,
      current_glucose: current_glucose ?? 6,
      insulin_to_carb_ratio: user.insulin_to_carb_ratio ?? 10,
      height_cm: user.height_cm,
      weight_kg: user.weight_kg,
      age: user.age,
      gender: user.gender,
    });
    const meal = await Meal.create({
      user_id: user._id,
      image_url: imageUrl,
      foods_detected: stage1.foods_detected || [],
      total_carbs: stage1.total_estimated_carbs_g || 0,
      total_calories: stage1.total_estimated_calories || 0,
      predicted_spike: stage2.predicted_glucose_spike_mmol_L,
      risk_level: stage2.risk_level,
    });
    res.json({ stage1, stage2, mealId: meal._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/meal-history', authMiddleware, async (req, res) => {
  try {
    const meals = await Meal.find({ user_id: req.user._id }).sort({ timestamp: -1 }).limit(50);
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
