import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { useEffect, useRef, useState } from 'react';
import PhoneMockup from '../components/PhoneMockup';

function useScrollSections(count) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.current.indexOf(entry.target);
            if (idx !== -1) setActive(idx);
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { active, refs };
}

/* Mini phone screen UIs */
function ScreenDashboard() {
  return (
    <div className="h-full bg-[#fafaf8] flex flex-col">
      <div className="pt-10 px-5 pb-4">
        <p className="text-[10px] text-gray-400 font-medium">Good morning</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">Today's Overview</p>
      </div>
      <div className="px-5 flex gap-2">
        <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400">Carbs today</p>
          <p className="text-lg font-bold text-gray-900">127g</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-emerald-500 rounded-full" />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400">Glucose</p>
          <p className="text-lg font-bold text-gray-900">5.8</p>
          <p className="text-[9px] text-emerald-600 mt-1">Normal range</p>
        </div>
      </div>
      <div className="px-5 mt-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-2">Weekly trend</p>
          <svg viewBox="0 0 200 60" className="w-full">
            <polyline fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              points="0,45 30,35 60,50 90,25 120,30 150,15 180,20 200,10" />
            <polyline fill="rgba(16,185,129,0.08)" stroke="none"
              points="0,60 0,45 30,35 60,50 90,25 120,30 150,15 180,20 200,10 200,60" />
          </svg>
          <div className="flex justify-between mt-1 text-[8px] text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
      <div className="px-5 mt-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-1">Last meal</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🍛</div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800">Chicken Rice Bowl</p>
              <p className="text-[9px] text-gray-400">85g carbs • Moderate risk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenCamera() {
  return (
    <div className="h-full bg-gray-900 flex flex-col items-center justify-center relative">
      <div className="absolute top-10 left-5 right-5">
        <p className="text-white text-xs font-semibold text-center">Capture your meal</p>
      </div>
      <div className="w-44 h-44 rounded-2xl border-2 border-white/30 border-dashed flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <p className="text-white/60 text-[10px]">Position your meal here</p>
        </div>
      </div>
      <div className="absolute bottom-12 flex items-center gap-6">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-5 h-5 rounded bg-white/20" />
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white" />
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg">↻</div>
      </div>
    </div>
  );
}

function ScreenAnalysis() {
  return (
    <div className="h-full bg-[#fafaf8] flex flex-col">
      <div className="pt-10 px-5 pb-3">
        <p className="text-sm font-bold text-gray-900">Meal Analysis</p>
        <p className="text-[10px] text-gray-400 mt-0.5">AI-powered breakdown</p>
      </div>
      <div className="px-5">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-2">
          <div className="w-full h-20 bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg mb-2 flex items-center justify-center text-3xl">🥗</div>
          <div className="space-y-1.5">
            {[
              { name: 'Grilled Chicken', carbs: '0g', conf: 92 },
              { name: 'Brown Rice', carbs: '45g', conf: 88 },
              { name: 'Mixed Vegetables', carbs: '12g', conf: 85 },
            ].map((f) => (
              <div key={f.name} className="flex justify-between items-center text-[10px]">
                <span className="text-gray-800">{f.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{f.carbs}</span>
                  <div className="w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${f.conf}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-1">Total carbs</p>
          <p className="text-xl font-bold text-gray-900">57g</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[9px] text-amber-700 font-medium">Moderate impact</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenGlucose() {
  return (
    <div className="h-full bg-[#fafaf8] flex flex-col">
      <div className="pt-10 px-5 pb-3">
        <p className="text-sm font-bold text-gray-900">Glucose Prediction</p>
      </div>
      <div className="px-5 space-y-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-2">Predicted spike</p>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold text-gray-900">+3.2</p>
            <p className="text-[10px] text-gray-500 mb-1">mmol/L</p>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= 3 ? 'bg-amber-400' : 'bg-gray-100'}`} />
            ))}
          </div>
          <p className="text-[9px] text-amber-700 mt-1 font-medium">Moderate risk</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-1">Recommendation</p>
          <p className="text-[10px] text-gray-800 leading-relaxed">Reduce rice portion by 50%. Add more fiber-rich vegetables to slow glucose absorption.</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <p className="text-[9px] text-gray-400 mb-1.5">Healthier swaps</p>
          {['Quinoa instead of white rice', 'Add leafy greens', 'Include healthy fats'].map((alt) => (
            <div key={alt} className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[9px] text-gray-700">{alt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenQR() {
  return (
    <div className="h-full bg-[#fafaf8] flex flex-col items-center">
      <div className="pt-10 px-5 pb-4 w-full">
        <p className="text-sm font-bold text-gray-900 text-center">Scan & Upload</p>
        <p className="text-[10px] text-gray-400 text-center mt-0.5">Desktop → Mobile sync</p>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mx-5">
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          {/* QR code pattern */}
          {[0,1,2,3,4,5,6].map((row) =>
            [0,1,2,3,4,5,6].map((col) => {
              const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
              const show = isCorner || Math.random() > 0.4;
              return show ? (
                <rect key={`${row}-${col}`} x={col * 14 + 2} y={row * 14 + 2} width="12" height="12" rx="2" fill="#1a1a1a" />
              ) : null;
            })
          )}
        </svg>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 px-8 text-center">Scan with your phone camera to start uploading meals</p>
      <div className="mt-4 flex gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <div className="w-2 h-2 rounded-full bg-gray-200" />
        <div className="w-2 h-2 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export default function Landing() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;

  const sectionCount = 9;
  const { active, refs } = useScrollSections(sectionCount);

  const setRef = (idx) => (el) => {
    refs.current[idx] = el;
  };

  return (
    <div className="bg-[#fafaf8]">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-lg font-bold text-gray-900 tracking-tight">
            plate<span className="text-brand-purple">sense</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Get Started
            </Link>
            <Link to="/login" className="text-sm px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Scroll dots */}
      <div className="scroll-dots hidden lg:flex">
        {Array.from({ length: sectionCount }).map((_, i) => (
          <div
            key={i}
            className={`scroll-dot ${active === i ? 'active' : ''}`}
            onClick={() => refs.current[i]?.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

      {/* ── Section 1: Hero ── */}
      <section
        ref={setRef(0)}
        className="landing-section min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6"
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center leading-tight max-w-3xl mb-4">
          Own your meals.<br />
          <span className="text-brand-purple">PlateSense.</span> Make it count.
        </h1>
        <p className="text-gray-500 text-center max-w-lg mb-12 text-lg">
          AI-powered food analysis and glucose prediction, right from your phone.
        </p>
        <PhoneMockup>
          <ScreenDashboard />
        </PhoneMockup>
      </section>

      {/* ── Section 2: Scan & Upload (light) ── */}
      <section
        ref={setRef(1)}
        className="landing-section min-h-screen flex items-center bg-white px-6"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold text-brand-purple uppercase tracking-widest mb-3">Seamless sync</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Try the easiest way to<br />capture a meal.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Generate a QR code on your desktop. Scan it with your phone. Snap a photo of your meal — it appears on your dashboard instantly via real-time sync.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <PhoneMockup light>
              <ScreenQR />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ── Section 3: Camera capture (dark) ── */}
      <section
        ref={setRef(2)}
        className="landing-section dark-section min-h-screen flex items-center bg-[#1a1a1a] px-6"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <PhoneMockup>
              <ScreenCamera />
            </PhoneMockup>
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-purple-light uppercase tracking-widest mb-3">Mobile capture</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              No more guesswork.<br />Just point and shoot.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Use your phone's camera to capture any meal. Our AI handles the rest — detecting every food item and estimating carbs in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: AI Analysis (light) ── */}
      <section
        ref={setRef(3)}
        className="landing-section min-h-screen flex items-center bg-[#fafaf8] px-6"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold text-brand-purple uppercase tracking-widest mb-3">AI analysis</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              The analysis is<br />instant and clear.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Gemini AI identifies every food on your plate, estimates portions and carbohydrates, and gives you a confidence score for each detection.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <PhoneMockup light>
              <ScreenAnalysis />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ── Section 5: Glucose prediction (dark) ── */}
      <section
        ref={setRef(4)}
        className="landing-section dark-section min-h-screen flex items-center bg-[#1a1a1a] px-6"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <PhoneMockup>
              <ScreenGlucose />
            </PhoneMockup>
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-purple-light uppercase tracking-widest mb-3">Personalized</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Know your glucose<br />impact before eating.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Based on your diabetes type, insulin-to-carb ratio, height, weight, and age — PlateSense predicts how each meal will affect your blood sugar and suggests healthier alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 6: Feature cards (light) ── */}
      <section
        ref={setRef(5)}
        className="landing-section py-24 md:py-32 bg-white px-6"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-brand-purple uppercase tracking-widest mb-3 text-center">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 leading-tight">
            Everything you need.<br />Nothing you don't.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📸', title: 'Photo Analysis', desc: 'Snap a photo, get instant food detection and carb estimation powered by Gemini AI.' },
              { icon: '📊', title: 'Glucose Prediction', desc: 'Personalized glucose spike predictions based on your health profile.' },
              { icon: '📱', title: 'QR Mobile Sync', desc: 'Desktop generates QR, phone captures meal, results appear in real-time.' },
              { icon: '🥗', title: 'Smart Alternatives', desc: 'Get healthier food swap suggestions to keep your glucose in check.' },
              { icon: '📈', title: 'Weekly Trends', desc: 'Track your carb intake and meal patterns over time with visual charts.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication, encrypted data, sessions expire automatically.' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Full-width image band ── */}
      <section
        ref={setRef(6)}
        className="landing-section relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Eat smarter. Live better.</h2>
            <p className="text-white/80 text-lg">
              Every meal is an opportunity to take control of your health.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 8: Disclaimer / CTA (dark) ── */}
      <section
        ref={setRef(7)}
        className="landing-section dark-section py-24 md:py-32 bg-[#1a1a1a] px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-brand-purple-light uppercase tracking-widest mb-3">Important</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay informed.</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            This tool is not medical advice. Always consult your physician for diabetes management and treatment decisions. PlateSense is designed to assist, not replace, professional care.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer ref={setRef(8)} className="landing-section py-16 bg-[#111111] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            <div className="text-xl font-bold text-white tracking-tight">
              plate<span className="text-brand-purple">sense</span>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/login" className="text-gray-500 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-gray-500 hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
            <span>© 2025 PlateSense. All rights reserved.</span>
            <span>AI-powered diabetes meal assistant.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
