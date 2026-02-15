const API = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function headers(includeAuth = true) {
  const h = { 'Content-Type': 'application/json' };
  if (includeAuth) h.Authorization = `Bearer ${getToken()}`;
  return h;
}

export async function register(data) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function getMe() {
  const res = await fetch(`${API}/auth/me`, { headers: headers() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch user');
  return json;
}

export async function updateProfile(data) {
  const res = await fetch(`${API}/auth/profile`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Update failed');
  return json;
}

export async function createUploadSession() {
  const res = await fetch(`${API}/create-upload-session`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create session');
  return json;
}

export async function analyzeMeal(imageUrl, currentGlucose) {
  const res = await fetch(`${API}/analyze-meal`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ imageUrl, current_glucose: currentGlucose }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Analysis failed');
  return json;
}

export async function getMealHistory() {
  const res = await fetch(`${API}/meal-history`, { headers: headers() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch history');
  return json;
}

export async function getExercisePlan() {
  const res = await fetch(`${API}/exercise-plan`, {
    headers: headers(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch exercise plan');
  return json;
}

export async function generateExercisePlan() {
  const res = await fetch(`${API}/exercise-plan`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate exercise plan');
  return json;
}

export async function updateExercisePlan(data) {
  const res = await fetch(`${API}/exercise-plan`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update exercise plan');
  return json;
}

export async function getDietaryPlan() {
  const res = await fetch(`${API}/dietary-plan`, {
    headers: headers(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch dietary plan');
  return json;
}

export async function generateDietaryPlan() {
  const res = await fetch(`${API}/dietary-plan`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate dietary plan');
  return json;
}

export async function updateDietaryPlan(data) {
  const res = await fetch(`${API}/dietary-plan`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update dietary plan');
  return json;
}

export async function generateRepairMeal(region, status) {
  const res = await fetch(`${API}/brain-health/repair-meal`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ region, status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to generate repair meal');
  return json;
}

export async function getBrainHealthReport() {
  const res = await fetch(`${API}/brain-health`, {
    headers: headers(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch brain health report');
  return json;
}
