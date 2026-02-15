import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getBrainHealthReport } from '../services/api';
import ErrorBoundary from '../components/ErrorBoundary';

const BrainModel = lazy(() => import('../components/BrainModel'));

export default function BrainHealth() {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        setLoading(true);
        getBrainHealthReport()
            .then(data => {
                if (data && !data.error) setReport(data);
            })
            .catch(e => setErr(e.message))
            .finally(() => setLoading(false));
    }, []);

    const activeRegionData = selectedRegion ? report?.regions?.[selectedRegion] : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-brand-purple/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-brand-purple rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">Analyzing Neural Patterns</h2>
                <p className="text-slate-500 text-sm animate-pulse font-medium uppercase tracking-[0.2em]">Synchronizing with dietary data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-brand-purple selection:text-white">
            {/* Nav */}
            <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 px-6 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex gap-8 items-center">
                        <Link to="/dashboard" className="text-xl font-black text-white tracking-tighter">
                            plate<span className="text-brand-purple">sense</span>
                        </Link>
                        <div className="hidden md:flex gap-6">
                            <Link to="/dashboard" className="text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest">Dashboard</Link>
                            <Link to="/dietary-plan" className="text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest">Dietary</Link>
                            <Link to="/exercise-plan" className="text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest">Fitness</Link>
                            <Link to="/brain-health" className="text-xs font-bold text-white transition-all uppercase tracking-widest border-b-2 border-brand-purple pb-1">Mind</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-xs hidden sm:block font-mono bg-slate-800/50 px-3 py-1 rounded-full">{user?.email}</span>
                        <Link to="/profile" className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center hover:bg-brand-purple/40 transition-all">
                            <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                            <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">AI Cognitive Analysis</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your Mind <span className="text-slate-500">on PlateSense</span></h1>
                        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                            Discover how your specific nutrient intake stimulates neurotransmitters and modulates neural health across major brain regions.
                        </p>
                    </div>
                    {report && (
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl min-w-[200px] text-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Overall Cognitive Index</span>
                            <div className="text-5xl font-black text-white">{report.overall_score}</div>
                            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-brand-purple to-indigo-500 transition-all duration-1000"
                                    style={{ width: `${report.overall_score}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {err && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {err}
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: 3D Model Explorer */}
                    <div className="lg:col-span-7 space-y-6">
                        <ErrorBoundary fallback={
                            <div className="w-full h-[400px] bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800">
                                <div className="text-center">
                                    <p className="text-slate-400 font-medium">3D visualization unavailable</p>
                                    <p className="text-slate-600 text-sm mt-1">Select a region from the list below</p>
                                </div>
                            </div>
                        }>
                            <Suspense fallback={
                                <div className="w-full h-[400px] bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800">
                                    <div className="text-center">
                                        <svg className="animate-spin w-8 h-8 text-brand-purple mx-auto mb-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <p className="text-slate-500 text-sm">Loading 3D model...</p>
                                    </div>
                                </div>
                            }>
                                <BrainModel
                                    data={report}
                                    onRegionSelect={setSelectedRegion}
                                />
                            </Suspense>
                        </ErrorBoundary>

                        {/* Region Selector (works even if 3D fails) */}
                        {report?.regions && (
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(report.regions).map(([name, data]) => (
                                    <button
                                        key={name}
                                        onClick={() => setSelectedRegion(selectedRegion === name ? null : name)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedRegion === name
                                            ? 'bg-brand-purple text-white border-brand-purple'
                                            : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                                        }`}
                                    >
                                        {name} &middot; {data.score}%
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Cognitive Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {report?.mental_metrics && Object.entries(report.mental_metrics).map(([key, val]) => (
                                <div key={key} className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl hover:bg-slate-900/60 transition-all group">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 group-hover:text-slate-300 transition-colors">{key}</span>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-black text-white leading-none">{val}</span>
                                        <span className="text-[10px] text-slate-500 mb-0.5">/100</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Card */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-purple/10 transition-all"></div>
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.922-.606l7-15A1 1 0 0021.337 0H2.663a1 1 0 00-.922 1.394l7 15a1 1 0 00.922.606z" /></svg>
                                AI Neural Summary
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed italic">
                                "{report?.summary}"
                            </p>
                        </div>
                    </div>

                    {/* Right: Detailed Insights */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Region Detail Card */}
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl min-h-[400px]">
                            {selectedRegion && activeRegionData ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tight">{selectedRegion}</h2>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activeRegionData.status === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    activeRegionData.status === 'Negative' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {activeRegionData.status} Impact Detected
                                            </span>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="text-xl font-black text-white">{activeRegionData.score}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Analysis Breakdown</h4>
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            {activeRegionData.impact}
                                        </p>
                                    </div>

                                    {/* Related food insights for this region */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Biological Drivers</h4>
                                        <div className="space-y-2">
                                            {report.food_insights?.filter(f => f.region_affected.includes(selectedRegion)).map((f, i) => (
                                                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-400">
                                                    <span className="text-white font-bold">{f.food}</span>: {f.benefit}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border-2 border-dashed border-slate-700">
                                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting Input</p>
                                        <p className="text-slate-600 text-sm max-w-[200px]">Interact with the 3D model to reveal specialized region analysis.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-gradient-to-br from-brand-purple/20 to-indigo-500/20 border border-brand-purple/30 p-8 rounded-3xl">
                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Neuro-Optimization Plan
                            </h3>
                            <div className="space-y-4">
                                {report?.recommendations?.map((r, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-purple/20 text-brand-purple text-[10px] font-black flex items-center justify-center border border-brand-purple/20 group-hover:scale-110 transition-transform">{i + 1}</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{r}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
