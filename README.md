# PlateSense - AI Smart Diabetes Meal Assistant

Desktop web app with mobile camera integration for meal analysis and glucose impact prediction.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Chart.js, qrcode.react, Socket.io client
- **Backend:** Node.js, Express, Socket.io, Multer, MongoDB, Gemini API
- **Auth:** JWT

## Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Gemini API key

### Backend

```bash
cd server
cp .env.example .env
# Edit .env: set JWT_SECRET, MONGODB_URI, GEMINI_API_KEY
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Run

1. Start MongoDB
2. Start backend: `cd server && npm run dev`
3. Start frontend: `cd client && npm run dev`
4. Open http://localhost:5173
5. Register, complete profile, generate QR code
6. Scan QR with phone, capture meal, upload
7. Click "Analyze meal" on desktop

## Disclaimer

This tool is not medical advice. Always consult your physician.
