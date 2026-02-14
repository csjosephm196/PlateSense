import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { generateDietaryPlan } from '../services/gemini.js';
import DietaryPlan from '../models/DietaryPlan.js';

const router = Router();

// GET existing plan
router.get('/dietary-plan', authMiddleware, async (req, res) => {
    try {
        const plan = await DietaryPlan.findOne({ user_id: req.user._id });
        res.json(plan || { error: 'No plan found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GENERATE and SAVE plan
router.post('/dietary-plan', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        if (!user.height_cm || !user.weight_kg) {
            return res.status(400).json({ error: 'Please set your height and weight in your profile first.' });
        }
        const generatedPlan = await generateDietaryPlan({
            height_cm: user.height_cm,
            weight_kg: user.weight_kg,
            age: user.age || 30,
            gender: user.gender || 'Not specified',
            diabetes_type: user.diabetes_type || 'Type 2',
            dietary_restriction: user.dietary_restriction || 'None',
        });

        // Save to DB (Update or Create)
        const plan = await DietaryPlan.findOneAndUpdate(
            { user_id: user._id },
            { ...generatedPlan, user_id: user._id },
            { upsert: true, new: true }
        );

        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE plan manually
router.put('/dietary-plan', authMiddleware, async (req, res) => {
    try {
        const plan = await DietaryPlan.findOneAndUpdate(
            { user_id: req.user._id },
            req.body,
            { new: true }
        );
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
