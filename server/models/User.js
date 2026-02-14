import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  diabetes_type: { type: String, default: 'Type 2' },
  insulin_to_carb_ratio: { type: Number, default: 10 },
  baseline_glucose_range: { type: String, default: '4-7' },
  height_cm: { type: Number },
  weight_kg: { type: Number },
  age: { type: Number },
  gender: { type: String },
  dietary_restriction: { type: String, default: 'None' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
