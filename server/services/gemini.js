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
      "estimated_calories": number,
      "confidence": 0.0-1.0
    }
  ],
  "total_estimated_carbs_g": number,
  "total_estimated_calories": number
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

export async function generateExercisePlan(params) {
  const prompt = `Create a personalized weekly exercise plan for a person with the following profile:
- Height: ${params.height_cm} cm
- Weight: ${params.weight_kg} kg
- Age: ${params.age}
- Gender: ${params.gender}
- Diabetes type: ${params.diabetes_type}

Design an appropriate exercise plan considering their BMI and fitness level. Include a mix of cardio, strength training, and flexibility exercises. The plan should be safe for someone managing diabetes.

Return ONLY valid JSON, no markdown or extra text:
{
  "bmi": number,
  "fitness_assessment": "string describing their current estimated fitness level",
  "weekly_plan": [
    {
      "day": "Monday",
      "focus": "e.g. Cardio & Core",
      "exercises": [
        {
          "name": "Exercise name",
          "duration_minutes": number,
          "sets": number or null,
          "reps": number or null,
          "intensity": "Low|Moderate|High",
          "calories_burned_estimate": number,
          "instructions": "Brief how-to"
        }
      ],
      "total_duration_minutes": number,
      "total_calories_burned": number
    }
  ],
  "weekly_summary": {
    "total_workout_days": number,
    "rest_days": number,
    "estimated_weekly_calories_burned": number
  },
  "safety_notes": ["string"],
  "progression_tips": ["string"]
}`;

  const messages = [{ role: 'user', content: prompt }];
  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}

export async function generateDietaryPlan(params) {
  const prompt = `Create a personalized weekly dietary/meal plan for a person with the following profile:
- Height: ${params.height_cm} cm
- Weight: ${params.weight_kg} kg
- Age: ${params.age}
- Gender: ${params.gender}
- Diabetes type: ${params.diabetes_type}
- Dietary restriction: ${params.dietary_restriction}

Follow FDA dietary guidelines (2020-2025 Dietary Guidelines for Americans). The meal plan must strictly adhere to the "${params.dietary_restriction}" dietary restriction. Include appropriate calorie and carbohydrate targets for someone managing diabetes.

Return ONLY valid JSON, no markdown or extra text:
{
  "daily_calorie_target": number,
  "daily_carb_target_g": number,
  "dietary_restriction": "${params.dietary_restriction}",
  "weekly_plan": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": {
          "name": "Meal name",
          "description": "Brief description",
          "foods": ["food item 1", "food item 2"],
          "calories": number,
          "carbs_g": number,
          "protein_g": number,
          "fat_g": number
        },
        "lunch": {
          "name": "Meal name",
          "description": "Brief description",
          "foods": ["food item 1", "food item 2"],
          "calories": number,
          "carbs_g": number,
          "protein_g": number,
          "fat_g": number
        },
        "dinner": {
          "name": "Meal name",
          "description": "Brief description",
          "foods": ["food item 1", "food item 2"],
          "calories": number,
          "carbs_g": number,
          "protein_g": number,
          "fat_g": number
        },
        "snacks": {
          "name": "Snack ideas",
          "description": "Brief description",
          "foods": ["snack item 1", "snack item 2"],
          "calories": number,
          "carbs_g": number,
          "protein_g": number,
          "fat_g": number
        }
      },
      "daily_totals": {
        "calories": number,
        "carbs_g": number,
        "protein_g": number,
        "fat_g": number
      }
    }
  ],
  "fda_guidelines_notes": ["string"],
  "diabetes_specific_tips": ["string"]
}`;

  const messages = [{ role: 'user', content: prompt }];
  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}

export async function analyzeBrainHealth(params) {
  const prompt = `Analyze the brain health impact of the following dietary data for a person with diabetes (${params.diabetes_type}):
- Current Dietary Plan: ${JSON.stringify(params.dietary_plan)}
- Recent Meals: ${JSON.stringify(params.recent_meals)}

Provide a detailed analysis of how this diet affects major brain regions and overall mental/physical health. Consider neurotransmitters, inflammation, energy levels, and long-term cognitive health.

Return ONLY valid JSON, no markdown or extra text. Strict JSON rules: NO trailing commas.
{
  "overall_score": number (0-100),
  "summary": "string",
  "regions": {
    "Prefrontal Cortex": {
      "status": "Positive|Neutral|Negative",
      "impact": "• Focus & Attention: Short sentence explaining why.\n• Personality Traits: Short sentence explaining why.\n• Decision Making: Short sentence explaining why.\n• Impulse Control: Short sentence explaining why.",
      "score": number (0-100)
    },
    "Frontal Lobe": {
      "status": "Positive|Neutral|Negative",
      "impact": "• Problem Solving: Short sentence explanation.\n• Muscle Control: Short sentence explanation.\n• Social Skills: Short sentence explanation.\n• Speech Production: Short sentence explanation.",
      "score": number (0-100)
    },
    "Parietal Lobe": {
      "status": "Positive|Neutral|Negative",
      "impact": "• Sensory Perception: Short sentence explanation.\n• Spatial Awareness: Short sentence explanation.\n• Object Recognition: Short sentence explanation.\n• Hand-Eye Coord.: Short sentence explanation.",
      "score": number (0-100)
    },
    "Occipital Lobe": {
       "status": "Positive|Neutral|Negative",
       "impact": "• Visual Processing: Short sentence explanation.\n• Depth Perception: Short sentence explanation.\n• Color Recognition: Short sentence explanation.\n• Motion Tracking: Short sentence explanation.",
       "score": number (0-100)
    },
    "Temporal Lobe": {
       "status": "Positive|Neutral|Negative",
       "impact": "• Memory Storage: Short sentence explanation.\n• Hearing & Audio: Short sentence explanation.\n• Language Logic: Short sentence explanation.\n• Face Recognition: Short sentence explanation.",
       "score": number (0-100)
    },
    "Cerebellum": {
       "status": "Positive|Neutral|Negative",
       "impact": "• Physical Balance: Short sentence explanation.\n• Coordination: Short sentence explanation.\n• Fine Motor Skills: Short sentence explanation.\n• Posture Control: Short sentence explanation.",
       "score": number (0-100)
    },
    "Amygdala": {
       "status": "Positive|Neutral|Negative",
       "impact": "• Emotional Processing: Short sentence explanation.\n• Fear Response: Short sentence explanation.\n• Anxiety Regulation: Short sentence explanation.\n• Survival Instincts: Short sentence explanation.",
       "score": number (0-100)
    },
    "Hippocampus": {
       "status": "Positive|Neutral|Negative",
       "impact": "• Long-term Memory: Short sentence explanation.\n• Spatial Navigation: Short sentence explanation.\n• Learning Capacity: Short sentence explanation.\n• Emotional Context: Short sentence explanation.",
       "score": number (0-100)
    }
  },
  "mental_metrics": {
    "focus": number (0-100),
    "mood": number (0-100),
    "energy": number (0-100),
    "clarity": number (0-100)
  },
  "food_insights": [
    {
      "food": "string",
      "region_affected": "string (Must match one of the region keys above)",
      "benefit": "string"
    }
  ],
  "recommendations": ["string"]
}`;

  const messages = [{ role: 'user', content: prompt }];
  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}

export async function generateRepairMeal(params) {
  const prompt = `Suggest 3 distinct food items that are scientifically linked to the unique functions of the "${params.region}" (Status: ${params.status}).

CRITICAL: Do NOT provide generic brain advice. The foods must be specific to the anatomy:
- If Region is Occipital Lobe -> Focus on Lutein/Zeaxanthin (Vision).
- If Region is Hippocampus -> Focus on BDNF boosters/Memory.
- If Region is Prefrontal Cortex -> Focus on Dopamine/Focus.
- If Region is Cerebellum -> Focus on Motor control/Coordination.

For each food, list the specific bio-compound that helps *this specific region*.

Return ONLY valid JSON, no markdown. Strict JSON rules: NO trailing commas.
{
  "title": "Region-Specific Fuel",
  "foods": [
    {
      "name": "Food Name",
      "nutrients": "Specific Bio-compound",
      "benefit": "Mechanism of action for this region"
    }
  ]
}`;

  const messages = [{ role: 'user', content: prompt }];
  const json = await callOpenRouter(messages);
  return JSON.parse(json);
}

