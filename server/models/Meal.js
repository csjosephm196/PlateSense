import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String, required: true },
  foods_detected: { type: Array, default: [] },
  total_carbs: { type: Number, default: 0 },
  total_calories: { type: Number, default: 0 },
  predicted_spike: { type: String },
  risk_level: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Meal', mealSchema);
