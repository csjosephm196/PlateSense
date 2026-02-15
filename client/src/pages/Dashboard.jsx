import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { createUploadSession, analyzeMeal, getMealHistory } from '../services/api';
import { createSocket } from '../services/socket';
import QRGenerator from '../components/QRGenerator';
import MealDisplay from '../components/MealDisplay';
import MealResults from '../components/MealResults';
import GlucoseChart from '../components/GlucoseChart';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [mealHistory, setMealHistory] = useState([]);

  const refreshSession = useCallback(async () => {
    const { sessionId: id } = await createUploadSession();
    setSessionId(id);
    setUploadedImage(null);
    setAnalysis(null);
    return id;
  }, []);

  useEffect(() => {
    refreshSession().catch(err => console.error('Session refresh failed:', err));
  }, [refreshSession]);

  useEffect(() => {
    if (!sessionId) return;
    const socket = createSocket(sessionId);
    socket.on('meal-image-uploaded', ({ imageUrl }) => setUploadedImage(imageUrl));
    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    getMealHistory().then(setMealHistory).catch(() => { });
  }, [analysis]);

  async function handleAnalyze() {
    if (!uploadedImage) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await analyzeMeal(uploadedImage, currentGlucose ? Number(currentGlucose) : undefined);
      setAnalysis(res);
    } catch (err) {
      setAnalysis({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  const todayMealsArr = mealHistory.filter(
    (m) => new Date(m.timestamp).toDateString() === new Date().toDateString()
  );

  const todayCarbs = todayMealsArr.reduce((sum, m) => sum + (m.total_carbs || 0), 0);
  const todayCalories = todayMealsArr.reduce((sum, m) => sum + (m.total_calories || 0), 0);
  const todayMeals = todayMealsArr.length;

  const lastRisk = mealHistory[0]?.risk_level || '—';

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
              plate<span className="text-brand-purple">sense</span>
            </Link>
            <Link to="/exercise-plan" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Exercise Plan</Link>
            <Link to="/dietary-plan" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Dietary Plan</Link>
            <Link to="/brain-health" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Brain Health</Link>
            <Link to="/profile" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Profile</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-gray-500 text-sm hidden md:block">{user?.email}</span>
            </div>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Welcome + Disclaimer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Here's your meal dashboard</p>
          </div>
          <Link
            to="/brain-health"
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Feature</p>
              <p className="text-sm font-bold">Mind-Body Explorer</p>
            </div>
          </Link>
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Not medical advice. Always consult your physician.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">Today's Carbs</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayCarbs}<span className="text-sm font-normal text-gray-400 ml-1">g</span></p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">Today's Calories</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayCalories}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">Meals Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayMeals}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">Last Risk</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{lastRisk}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">Total Meals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mealHistory.length}</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* QR Code - left panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                <h2 className="font-semibold text-gray-900">Scan to Upload</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">Use your phone camera to capture a meal</p>
            </div>
            <div className="p-6">
              <QRGenerator sessionId={sessionId} onRefresh={refreshSession} />
            </div>
          </div>

          {/* Meal upload + analyze - right panel */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Meal Capture</h2>
              <p className="text-xs text-gray-400 mt-1">
                {uploadedImage ? 'Photo received! Enter glucose and analyze.' : 'Waiting for your phone to upload a photo...'}
              </p>
            </div>
            <div className="p-6">
              <MealDisplay imageUrl={uploadedImage} />
              {uploadedImage && (
                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Glucose (mmol/L)"
                    value={currentGlucose}
                    onChange={(e) => setCurrentGlucose(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition text-sm"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="px-6 py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm shadow-brand-purple/20"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        Analyze
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis results */}
        {analysis && <MealResults analysis={analysis} />}

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-900">Weekly Trends</h2>
              <p className="text-xs text-gray-400 mt-1">Your carb intake over the last 7 meals</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
              <span className="text-xs text-gray-500">Carbs (g)</span>
            </div>
          </div>
          <div className="p-6">
            <GlucoseChart meals={mealHistory} />
          </div>
        </div>

        {/* Recent meals */}
        {mealHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Recent Meals</h2>
              <p className="text-xs text-gray-400 mt-1">Your latest analyzed meals</p>
            </div>
            <div className="divide-y divide-gray-50">
              {mealHistory.slice(0, 5).map((m) => (
                <div key={m._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <img src={m.image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {m.foods_detected?.map((f) => f.name).join(', ') || 'Meal'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(m.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{m.total_carbs}g carbs</p>
                    <p className="text-xs text-gray-500">{m.total_calories || 0} kcal</p>
                    <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${m.risk_level?.toLowerCase() === 'low' ? 'bg-emerald-50 text-emerald-700' :
                      m.risk_level?.toLowerCase() === 'moderate' ? 'bg-amber-50 text-amber-700' :
                        m.risk_level?.toLowerCase() === 'high' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-500'
                      }`}>
                      {m.risk_level || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
