import mongoose from 'mongoose';

const dietaryPlanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    daily_calorie_target: { type: Number },
    daily_carb_target_g: { type: Number },
    dietary_restriction: { type: String },
    weekly_plan: [
        {
            day: { type: String, required: true },
            meals: {
                breakfast: {
                    name: { type: String },
                    description: { type: String },
                    foods: [{ type: String }],
                    calories: { type: Number },
                    carbs_g: { type: Number },
                    protein_g: { type: Number },
                    fat_g: { type: Number }
                },
                lunch: {
                    name: { type: String },
                    description: { type: String },
                    foods: [{ type: String }],
                    calories: { type: Number },
                    carbs_g: { type: Number },
                    protein_g: { type: Number },
                    fat_g: { type: Number }
                },
                dinner: {
                    name: { type: String },
                    description: { type: String },
                    foods: [{ type: String }],
                    calories: { type: Number },
                    carbs_g: { type: Number },
                    protein_g: { type: Number },
                    fat_g: { type: Number }
                },
                snacks: {
                    name: { type: String },
                    description: { type: String },
                    foods: [{ type: String }],
                    calories: { type: Number },
                    carbs_g: { type: Number },
                    protein_g: { type: Number },
                    fat_g: { type: Number }
                }
            },
            daily_totals: {
                calories: { type: Number },
                carbs_g: { type: Number },
                protein_g: { type: Number },
                fat_g: { type: Number }
            }
        }
    ],
    fda_guidelines_notes: [{ type: String }],
    diabetes_specific_tips: [{ type: String }]
}, { timestamps: true });

// Ensure one plan per user
dietaryPlanSchema.index({ user_id: 1 });

export default mongoose.model('DietaryPlan', dietaryPlanSchema);
