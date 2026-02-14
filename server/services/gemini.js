import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString('base64'),
      mimeType: mimeType || 'image/jpeg',
    },
  };
}

export async function analyzeFoodImage(imagePath) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const imagePart = fileToGenerativePart(imagePath, 'image/jpeg');
  const prompt = `Analyze this meal image. Return ONLY valid JSON, no markdown or extra text:
{
  "foods_detected": [
    {
      "name": "Food name",
      "estimated_portion": "e.g. 1 cup",
      "estimated_carbs_g": number,
      "confidence": 0.0-1.0
    }
  ],
  "total_estimated_carbs_g": number
}`;
  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text();
  const json = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(json);
}

export async function predictGlucoseImpact(params) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Given: total carbs ${params.total_carbs}g, diabetes type ${params.diabetes_type}, current glucose ${params.current_glucose} mmol/L, insulin-to-carb ratio ${params.insulin_to_carb_ratio}, height ${params.height_cm}cm, weight ${params.weight_kg}kg, age ${params.age}, gender ${params.gender}.
Predict glucose impact. Return ONLY valid JSON, no markdown or extra text:
{
  "predicted_glucose_spike_mmol_L": "e.g. 3-4",
  "risk_level": "Low|Moderate|High",
  "recommendation": "string",
  "healthier_alternatives": ["string"],
  "explanation": "string",
  "confidence_score": 0.0-1.0
}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const json = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(json);
}
