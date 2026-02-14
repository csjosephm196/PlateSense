import fs from 'fs';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-lite-001';

async function callOpenRouter(messages) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return text.replace(/```json\n?|\n?```/g, '').trim();
}

export async function analyzeFoodImage(imagePath) {
  const base64 = fs.readFileSync(imagePath).toString('base64');
  const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

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

  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
      ],
    },
  ];

  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}

export async function predictGlucoseImpact(params) {
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

  const messages = [
    { role: 'user', content: prompt },
  ];

  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}
