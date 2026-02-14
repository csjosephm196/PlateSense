import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const SESSION_EXPIRY_MINUTES = 10;

router.post('/create-upload-session', authMiddleware, async (req, res) => {
  try {
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000);
    await Session.create({
      sessionId,
      user_id: req.user._id,
      expiresAt,
    });
    res.json({ sessionId, expiresAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
