import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getBrainHealthReport } from '../services/api';
// import BrainModel from '../components/BrainModel';
import ErrorBoundary from '../components/ErrorBoundary';

const BrainModel = lazy(() => import('../components/BrainModel'));

const STATIC_REGION_INFO = {
    'Prefrontal Cortex': {
        score: 85, status: 'Positive',
        impact: "• Focus & Attention: Vital for sustaining concentration on tasks.\n• Personality Traits: Shapes your unique character and social behavior.\n• Decision Making: Powers logical reasoning and choices.\n• Impulse Control: Helps regulate immediate reactions.",
        food_insights: [
            { food: "Walnuts", benefit: "High in DHA for executive function" },
            { food: "Blueberries", benefit: "Antioxidants reduce cognitive decline" }
        ]
    },
    'Frontal Lobe': {
        score: 80, status: 'Neutral',
        impact: "• Problem Solving: Enables finding solutions to complex issues.\n• Muscle Control: Coordinates voluntary body movements.\n• Social Skills: Governs interactions and empathy.\n• Speech Production: Essential for fluent verbal communication.",
        food_insights: [
            { food: "Broccoli", benefit: "Vitamin K enhances cognitive function" },
            { food: "Pumpkin Seeds", benefit: "Zinc for nerve signaling" }
        ]
    },
    'Parietal Lobe': {
        score: 75, status: 'Neutral',
        impact: "• Sensory Perception: Processes touch, temperature, and pain.\n• Spatial Awareness: key for navigation and physical orientation.\n• Object Recognition: Identifies shapes and textures instantly.\n• Hand-Eye Coord.: Critical for precise motor tasks.",
        food_insights: [
            { food: "Eggs", benefit: "Choline supports sensory integration" },
            { food: "Oranges", benefit: "Vitamin C prevents mental decline" }
        ]
    },
    'Occipital Lobe': {
        score: 82, status: 'Positive',
        impact: "• Visual Processing: Decodes visual signals from the eyes.\n• Depth Perception: Allows judging distances accurately.\n• Color Recognition: Distinguishes hues and shades.\n• Motion Tracking: Follows moving objects smoothly.",
        food_insights: [
            { food: "Spinach", benefit: "Lutein protects brain cells" },
            { food: "Carrots", benefit: "Beta-carotene for visual acuity" }
        ]
    },
    'Temporal Lobe': {
        score: 84, status: 'Positive',
        impact: "• Memory Storage: Archives long-term personal experiences.\n• Hearing & Audio: Processes sounds and spoken language.\n• Language Logic: Helps understand structure and meaning.\n• Face Recognition: Identifies familiar people instantly.",
        food_insights: [
            { food: "Salmon", benefit: "Omega-3s support memory circuits" },
            { food: "Turmeric", benefit: "Curcumin clears amyloid plaques" }
        ]
    },
    'Cerebellum': {
        score: 88, status: 'Positive',
        impact: "• Physical Balance: Maintains stability while standing or moving.\n• Coordination: Synchronizes complex muscle actions.\n• Fine Motor Skills: Enables precise dexterity and control.\n• Posture Control: Supports upright body alignment.",
        food_insights: [
            { food: "Whole Grains", benefit: "Steady energy for motor control" },
            { food: "Avocado", benefit: "Healthy fats for blood flow" }
        ]
    },
    'Amygdala': {
        score: 70, status: 'Neutral',
        impact: "• Emotional Processing: Decodes feelings and social cues.\n• Fear Response: triggers reaction to perceived threats.\n• Anxiety Regulation: Manages stress and unease levels.\n• Survival Instincts: Drives fight-or-flight reactions.",
        food_insights: [
            { food: "Dark Chocolate", benefit: "Flavonoids improve mood regulation" },
            { food: "Green Tea", benefit: "L-theanine reduces anxiety" }
        ]
    },
    'Hippocampus': {
        score: 86, status: 'Positive',
        impact: "• Long-term Memory: Converts new info into lasting memories.\n• Spatial Navigation: Creates mental maps of environments.\n• Learning Capacity: Facilitates acquiring new knowledge.\n• Emotional Context: Links feelings to specific memories.",
        food_insights: [
            { food: "Rosemary", benefit: "Compounds improve memory retention" },
            { food: "Olive Oil", benefit: "Polyphenols support learning" }
        ]
    }
};

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
                if (data) {
                    if (data.error) {
                        setErr(data.error);
                    } else {
                        setReport(data);
                    }
                } else {
                    setErr('No data received from server');
                }
            })
            .catch(e => setErr(e.message))
            .finally(() => setLoading(false));
    }, []);

    const activeRegionData = selectedRegion ? (report?.regions?.[selectedRegion] || STATIC_REGION_INFO[selectedRegion]) : null;

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
                        <ErrorBoundary>
                            <Suspense fallback={<div className="text-white p-10 border border-slate-800 rounded-3xl text-center">Loading 3D Model...</div>}>
                                <BrainModel
                                    data={report}
                                    onRegionSelect={setSelectedRegion}
                                />
                            </Suspense>
                        </ErrorBoundary>

                        {/* Cognitive Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {report?.mental_metrics && Object.entries(report.mental_metrics).map(([key, val]) => {
                                const styles = {
                                    focus: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
                                    mood: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
                                    energy: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
                                    clarity: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' }
                                };
                                const style = styles[key.toLowerCase()] || { bg: 'bg-slate-900/40', border: 'border-slate-800/60', text: 'text-slate-500' };

                                return (
                                    <div key={key} className={`${style.bg} border ${style.border} p-5 rounded-3xl hover:bg-opacity-20 transition-all group`}>
                                        <span className={`text-[10px] font-bold ${style.text} uppercase tracking-widest block mb-2`}>{key}</span>
                                        <div className="flex items-end gap-1 mb-3">
                                            <span className="text-2xl font-black text-white leading-none">{val}</span>
                                            <span className="text-[10px] text-slate-400 mb-0.5">/100</span>
                                        </div>
                                        {/* White Bar */}
                                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-1000"
                                                style={{ width: `${val}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
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
                                        <ul className="space-y-2">
                                            {activeRegionData.impact.split('\n').map((line, i) => (
                                                line.trim() && (
                                                    <li key={i} className="text-slate-300 leading-relaxed text-sm">
                                                        {line.trim()}
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Related food insights for this region */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Biological Drivers</h4>
                                        <div className="space-y-2">
                                            {(report?.food_insights?.filter(f => f.region_affected.includes(selectedRegion))?.length
                                                ? report.food_insights.filter(f => f.region_affected.includes(selectedRegion))
                                                : activeRegionData?.food_insights || []
                                            ).map((f, i) => (
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
