import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { analyzeBrainHealth, generateRepairMeal } from '../services/gemini.js';
import DietaryPlan from '../models/DietaryPlan.js';
import Meal from '../models/Meal.js';

const router = Router();

router.get('/brain-health', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        // Fetch user's dietary plan
        const dietaryPlan = await DietaryPlan.findOne({ user_id: user._id });

        // Fetch recent meals (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentMeals = await Meal.find({
            user_id: user._id,
            timestamp: { $gte: sevenDaysAgo }
        }).sort({ timestamp: -1 });

        const analysis = await analyzeBrainHealth({
            diabetes_type: user.diabetes_type || 'Type 2',
            dietary_plan: dietaryPlan || 'No dietary plan set',
            recent_meals: recentMeals.length > 0 ? recentMeals : 'No recent meals tracked'
        });

        res.json(analysis);
    } catch (err) {
        console.error('Brain health analysis failed:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/brain-health/repair-meal', async (req, res) => {
    try {
        const { region, status } = req.body;
        if (!region) return res.status(400).json({ error: 'Region is required' });

        const meal = await generateRepairMeal({ region, status });
        res.json(meal);
    } catch (err) {
        console.error('Repair meal API error:', err);
        res.status(500).json({ error: 'Failed to generate repair meal' });
    }
});

export default router;
