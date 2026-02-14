import mongoose from 'mongoose';

const exercisePlanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bmi: { type: Number },
    fitness_assessment: { type: String },
    weekly_plan: [
        {
            day: { type: String, required: true },
            focus: { type: String },
            exercises: [
                {
                    name: { type: String },
                    duration_minutes: { type: Number },
                    sets: { type: Number },
                    reps: { type: Number },
                    intensity: { type: String },
                    calories_burned_estimate: { type: Number },
                    instructions: { type: String }
                }
            ],
            total_duration_minutes: { type: Number },
            total_calories_burned: { type: Number }
        }
    ],
    weekly_summary: {
        total_workout_days: { type: Number },
        rest_days: { type: Number },
        estimated_weekly_calories_burned: { type: Number }
    },
    safety_notes: [{ type: String }],
    progression_tips: [{ type: String }]
}, { timestamps: true });

// Ensure one plan per user (upsert logic will use this)
exercisePlanSchema.index({ user_id: 1 });

export default mongoose.model('ExercisePlan', exercisePlanSchema);
