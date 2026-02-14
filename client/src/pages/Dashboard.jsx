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
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!sessionId) return;
    const socket = createSocket(sessionId);
    socket.on('meal-image-uploaded', ({ imageUrl }) => setUploadedImage(imageUrl));
    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    getMealHistory().then(setMealHistory).catch(() => {});
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

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="text-xl font-bold text-slate-900">
            Plate<span className="text-brand-purple">Sense</span>
          </Link>
          <Link to="/profile" className="text-slate-600 hover:text-brand-purple font-medium transition-colors">Profile</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm">{user?.email}</span>
          <button onClick={logout} className="text-slate-500 hover:text-slate-700 text-sm font-medium">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
          This tool is not medical advice. Always consult your physician.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Scan to upload meal</h2>
            <QRGenerator sessionId={sessionId} onRefresh={refreshSession} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Uploaded meal</h2>
            <MealDisplay imageUrl={uploadedImage} />
            {uploadedImage && (
              <div className="mt-4 space-y-3">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Current glucose (mmol/L)"
                  value={currentGlucose}
                  onChange={(e) => setCurrentGlucose(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Analyzing...' : 'Analyze meal'}
                </button>
              </div>
            )}
          </div>
        </div>

        {analysis && <MealResults analysis={analysis} />}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Weekly trends</h2>
          <GlucoseChart meals={mealHistory} />
        </div>
      </div>
    </div>
  );
}
