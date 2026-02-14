import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { generateExercisePlan } from '../services/gemini.js';

const router = Router();

router.post('/exercise-plan', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        if (!user.height_cm || !user.weight_kg) {
            return res.status(400).json({ error: 'Please set your height and weight in your profile first.' });
        }
        const plan = await generateExercisePlan({
            height_cm: user.height_cm,
            weight_kg: user.weight_kg,
            age: user.age || 30,
            gender: user.gender || 'Not specified',
            diabetes_type: user.diabetes_type || 'Type 2',
        });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
