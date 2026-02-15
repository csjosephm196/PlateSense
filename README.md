# PlateSense

AI-powered diabetes meal assistant with real-time mobile camera integration, glucose impact prediction, personalized dietary and exercise plans, and 3D brain health visualization.

---

## Features

- **Meal Analysis** -- Snap a photo of any meal and get instant AI-detected food items, carb/calorie estimates, and portion sizes.
- **Glucose Impact Prediction** -- Predicts blood sugar spikes based on meal content and your personal diabetes profile (type, insulin-to-carb ratio, baseline glucose, BMI).
- **QR Code Mobile Upload** -- Generate a QR code on desktop, scan it with your phone, capture a meal photo, and it streams to the dashboard in real time via WebSockets.
- **Dietary Plan Generator** -- AI-generated personalized weekly meal plans following FDA dietary guidelines, tailored to your diabetes type and dietary restrictions.
- **Exercise Plan Generator** -- AI-generated personalized weekly workout plans considering BMI, fitness level, and diabetes safety.
- **Brain Health Analysis** -- Analyze how your diet impacts brain regions (Prefrontal Cortex, Hippocampus, Amygdala, etc.) with an interactive 3D brain model.
- **Meal History & Trends** -- Track meals over time with weekly carb/calorie charts and risk level monitoring.
- **JWT Authentication** -- Secure user accounts with registration, login, and profile management.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **3D Visualization** | Three.js, React Three Fiber, React Three Drei |
| **Charts** | Chart.js, react-chartjs-2 |
| **Real-time** | Socket.IO (client + server) |
| **QR Codes** | qrcode.react |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **File Upload** | Multer |
| **AI** | Gemini 2.0 Flash Lite via OpenRouter API |

---

## Project Structure

```
PlateSense/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrainModel.jsx       # Interactive 3D brain with region hotspots
│   │   │   ├── ErrorBoundary.jsx     # React error boundary for graceful failures
│   │   │   ├── GlucoseChart.jsx      # Weekly carb/calorie trend chart
│   │   │   ├── MealDisplay.jsx       # Uploaded meal image display
│   │   │   ├── MealResults.jsx       # AI analysis results (foods, carbs, risk)
│   │   │   ├── PhoneMockup.jsx       # Phone frame for landing page
│   │   │   └── QRGenerator.jsx       # QR code for mobile upload sessions
│   │   ├── pages/
│   │   │   ├── BrainHealth.jsx       # 3D brain health analysis page
│   │   │   ├── Dashboard.jsx         # Main dashboard with QR, analysis, stats
│   │   │   ├── DietaryPlan.jsx       # Weekly meal plan viewer/editor
│   │   │   ├── ExercisePlan.jsx      # Weekly workout plan viewer/editor
│   │   │   ├── Landing.jsx           # Public landing page
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── MobileUpload.jsx      # Mobile camera upload page
│   │   │   ├── Profile.jsx           # User profile editor
│   │   │   └── Register.jsx          # Registration page
│   │   ├── services/
│   │   │   ├── api.js                # All API client functions
│   │   │   ├── auth.jsx              # AuthContext provider & useAuth hook
│   │   │   └── socket.js             # Socket.IO client factory
│   │   ├── App.jsx                   # Router and route definitions
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles + Tailwind directives
│   ├── vite.config.js                # Vite config (proxy, host)
│   ├── tailwind.config.js            # Tailwind config (brand colors, fonts)
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── DietaryPlan.js            # Dietary plan schema
│   │   ├── ExercisePlan.js           # Exercise plan schema
│   │   ├── Meal.js                   # Meal analysis schema
│   │   ├── Session.js                # Upload session schema (TTL)
│   │   └── User.js                   # User schema
│   ├── routes/
│   │   ├── auth.js                   # Register, login, profile
│   │   ├── brain.js                  # Brain health analysis
│   │   ├── diet.js                   # Dietary plan CRUD
│   │   ├── exercise.js               # Exercise plan CRUD
│   │   ├── meal.js                   # Meal upload & analysis
│   │   └── session.js                # Upload session creation
│   ├── services/
│   │   ├── gemini.js                 # OpenRouter AI service (6 functions)
│   │   └── socket.js                 # Socket.IO server setup
│   ├── index.js                      # Express server entry point
│   └── package.json
├── .env.example
├── .gitignore
└── package.json                      # Root scripts (install:all, server, client)
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update user profile |

### Meal Analysis (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/create-upload-session` | Yes | Create a QR upload session |
| POST | `/api/upload-meal-image` | No | Upload image from mobile (multipart) |
| POST | `/api/analyze-meal` | Yes | Run AI analysis on uploaded meal |
| GET | `/api/meal-history` | Yes | Get user's meal history |

### Dietary Plan (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dietary-plan` | Yes | Get saved dietary plan |
| POST | `/api/dietary-plan` | Yes | Generate new AI dietary plan |
| PUT | `/api/dietary-plan` | Yes | Update dietary plan manually |

### Exercise Plan (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/exercise-plan` | Yes | Get saved exercise plan |
| POST | `/api/exercise-plan` | Yes | Generate new AI exercise plan |
| PUT | `/api/exercise-plan` | Yes | Update exercise plan manually |

### Brain Health (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/brain-health` | Yes | Get brain health analysis |

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |

---

## AI Service Functions

All AI calls go through OpenRouter using the `google/gemini-2.0-flash-lite-001` model:

| Function | Description |
|----------|-------------|
| `analyzeFoodImage()` | Accepts a meal image, returns detected foods with portion sizes, carbs, and calories |
| `predictGlucoseImpact()` | Predicts glucose spike (mmol/L), risk level, recommendations, and healthier alternatives |
| `generateExercisePlan()` | Creates a 7-day workout plan with exercises, sets, reps, intensity, and calorie estimates |
| `generateDietaryPlan()` | Creates a 7-day meal plan following FDA guidelines with macro breakdowns |
| `analyzeBrainHealth()` | Analyzes dietary impact on 6 brain regions with cognitive metrics and food insights |
| `generateRepairMeal()` | Suggests targeted meals to improve specific brain region health |

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local install or MongoDB Atlas)
- **OpenRouter API Key** (get one at [openrouter.ai](https://openrouter.ai))

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PlateSense.git
cd PlateSense
```

### 2. Install all dependencies

```bash
npm run install:all
```

Or install separately:

```bash
cd server && npm install
cd ../client && npm install --legacy-peer-deps
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
JWT_SECRET=change-this-to-a-random-secret-string
MONGODB_URI=mongodb://localhost:27017/platesense
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `OPENROUTER_API_KEY` | API key from [openrouter.ai](https://openrouter.ai) |
| `CLIENT_URL` | Frontend URL for CORS (default http://localhost:5173) |
| `UPLOAD_DIR` | Directory for uploaded meal images |

### 4. Start MongoDB

If using a local install:

```bash
mongod
```

If using MongoDB Atlas, make sure your IP is whitelisted and update `MONGODB_URI` accordingly.

### 5. Start the app

From the root directory:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

Or run them individually:

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

### 6. Open the app

Navigate to **http://localhost:5173**

---

## How to Use

1. **Register** an account and fill in your diabetes profile (type, insulin-to-carb ratio, height, weight, age, etc.)
2. **Dashboard** -- Click "Generate QR" to create a mobile upload session
3. **Scan the QR code** with your phone's camera
4. **Take a photo** of your meal on the phone upload page
5. The image streams to the dashboard in **real time** via WebSocket
6. Enter your **current glucose level** and click **Analyze**
7. View **detected foods**, **carb estimates**, **glucose spike prediction**, and **risk level**
8. Explore your **Dietary Plan**, **Exercise Plan**, and **Brain Health** from the navigation bar
9. Generate **AI-powered plans** tailored to your profile with one click

---

## Real-time Architecture

```
Desktop (Dashboard)              Mobile (Phone)
     │                                │
     ├── Create upload session ──►    │
     │   (generates sessionId)        │
     │                                │
     ├── Show QR code ──────────►  Scan QR
     │                                │
     │                           Take photo
     │                                │
     │   ◄── Socket.IO event ────  Upload image
     │   (meal-image-uploaded)        │
     │                                │
     ├── Display image                │
     ├── Click "Analyze"              │
     ├── AI analysis ──► Gemini       │
     └── Show results                 │
```

---

## Database Models

### User
`email`, `password_hash`, `diabetes_type`, `insulin_to_carb_ratio`, `baseline_glucose_range`, `height_cm`, `weight_kg`, `age`, `gender`, `dietary_restriction`

### Meal
`user_id`, `image_url`, `foods_detected[]`, `total_carbs`, `total_calories`, `predicted_spike`, `risk_level`, `timestamp`

### Session
`sessionId`, `user_id`, `createdAt`, `expiresAt` (auto-deletes after TTL)

### DietaryPlan
`user_id`, `daily_calorie_target`, `daily_carb_target_g`, `dietary_restriction`, `weekly_plan[]`, `fda_guidelines_notes[]`, `diabetes_specific_tips[]`

### ExercisePlan
`user_id`, `bmi`, `fitness_assessment`, `weekly_plan[]`, `weekly_summary`, `safety_notes[]`, `progression_tips[]`

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Install all | `npm run install:all` | Install server + client dependencies |
| Start server | `npm run server` | Start backend with nodemon |
| Start client | `npm run client` | Start Vite dev server |
| Build client | `cd client && npm run build` | Production build |

---

## Disclaimer

This tool is for educational and demonstration purposes only. It is **not medical advice**. Always consult your physician or healthcare provider for diabetes management decisions.

---

## License

MIT
