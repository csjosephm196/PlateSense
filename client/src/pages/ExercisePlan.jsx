import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getExercisePlan } from '../services/api';

const intensityColor = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-red-50 text-red-700 border-red-200',
};

const dayColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-emerald-600',
];

export default function ExercisePlan() {
    const { user } = useAuth();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleGenerate() {
        setLoading(true);
        setError('');
        setPlan(null);
        try {
            const data = await getExercisePlan();
            setPlan(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faf9]">
            {/* Nav */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 px-6 py-3">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex gap-6 items-center">
                        <Link to="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
                            plate<span className="text-brand-purple">sense</span>
                        </Link>
                        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Dashboard</Link>
                        <Link to="/exercise-plan" className="text-sm text-brand-purple font-medium">Exercise Plan</Link>
                        <Link to="/dietary-plan" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Dietary Plan</Link>
                        <Link to="/profile" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Profile</Link>
                    </div>
                    <span className="text-gray-500 text-sm">{user?.email}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Exercise Plan</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            AI-generated weekly workout plan based on your profile
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-6 py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm shadow-brand-purple/20"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Generate Plan
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {plan && (
                    <div className="space-y-6">
                        {/* Summary cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">BMI</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.bmi?.toFixed(1)}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Workout Days</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.total_workout_days}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Rest Days</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.rest_days}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Weekly Calories Burned</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.estimated_weekly_calories_burned}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
                            </div>
                        </div>

                        {/* Fitness assessment */}
                        {plan.fitness_assessment && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">Fitness Assessment</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{plan.fitness_assessment}</p>
                            </div>
                        )}

                        {/* Weekly plan */}
                        <div className="space-y-4">
                            {plan.weekly_plan?.map((day, i) => (
                                <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className={`bg-gradient-to-r ${dayColors[i % dayColors.length]} px-6 py-3`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-white">{day.day} — {day.focus}</h3>
                                            <div className="flex gap-3 text-white/80 text-xs">
                                                <span>{day.total_duration_minutes} min</span>
                                                <span>{day.total_calories_burned} kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {day.exercises?.map((ex, j) => (
                                            <div key={j} className="px-6 py-3 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{ex.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {ex.duration_minutes} min
                                                        {ex.sets ? ` · ${ex.sets} sets` : ''}
                                                        {ex.reps ? ` × ${ex.reps} reps` : ''}
                                                        {ex.instructions ? ` · ${ex.instructions}` : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-xs text-gray-500">{ex.calories_burned_estimate} kcal</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${intensityColor[ex.intensity] || 'bg-gray-50 text-gray-500'}`}>
                                                        {ex.intensity}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Safety notes & tips */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {plan.safety_notes?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900">Safety Notes</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.safety_notes.map((n, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                                {n}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {plan.progression_tips?.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900">Progression Tips</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.progression_tips.map((t, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!plan && !loading && !error && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Generate Your Exercise Plan</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Click the button above to create a personalized weekly exercise plan based on your height, weight, age, and fitness level.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
