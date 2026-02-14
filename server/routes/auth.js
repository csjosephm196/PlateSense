import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, diabetes_type, insulin_to_carb_ratio, height_cm, weight_kg, age, gender } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash,
      diabetes_type: diabetes_type || 'Type 2',
      insulin_to_carb_ratio: insulin_to_carb_ratio ?? 10,
      height_cm: height_cm ?? null,
      weight_kg: weight_kg ?? null,
      age: age ?? null,
      gender: gender ?? null,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({
    id: u._id,
    email: u.email,
    diabetes_type: u.diabetes_type,
    insulin_to_carb_ratio: u.insulin_to_carb_ratio,
    baseline_glucose_range: u.baseline_glucose_range,
    height_cm: u.height_cm,
    weight_kg: u.weight_kg,
    age: u.age,
    gender: u.gender,
  });
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { height_cm, weight_kg, age, gender, diabetes_type, insulin_to_carb_ratio, baseline_glucose_range } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(height_cm != null && { height_cm }),
        ...(weight_kg != null && { weight_kg }),
        ...(age != null && { age }),
        ...(gender != null && { gender }),
        ...(diabetes_type != null && { diabetes_type }),
        ...(insulin_to_carb_ratio != null && { insulin_to_carb_ratio }),
        ...(baseline_glucose_range != null && { baseline_glucose_range }),
      },
      { new: true }
    );
    const u = user;
    res.json({
      id: u._id,
      email: u.email,
      diabetes_type: u.diabetes_type,
      insulin_to_carb_ratio: u.insulin_to_carb_ratio,
      baseline_glucose_range: u.baseline_glucose_range,
      height_cm: u.height_cm,
      weight_kg: u.weight_kg,
      age: u.age,
      gender: u.gender,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
