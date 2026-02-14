import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { generateDietaryPlan } from '../services/gemini.js';

const router = Router();

router.post('/dietary-plan', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        if (!user.height_cm || !user.weight_kg) {
            return res.status(400).json({ error: 'Please set your height and weight in your profile first.' });
        }
        const plan = await generateDietaryPlan({
            height_cm: user.height_cm,
            weight_kg: user.weight_kg,
            age: user.age || 30,
            gender: user.gender || 'Not specified',
            diabetes_type: user.diabetes_type || 'Type 2',
            dietary_restriction: user.dietary_restriction || 'None',
        });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
