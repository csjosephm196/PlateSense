import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getExercisePlan, generateExercisePlan, updateExercisePlan } from '../services/api';

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
    const [err, setErr] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        getExercisePlan()
            .then(data => {
                if (data && !data.error) setPlan(data);
            })
            .catch(e => setErr(e.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleGenerate() {
        setLoading(true);
        setErr('');
        try {
            const data = await generateExercisePlan();
            setPlan(data);
            setIsEditing(false);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setErr('');
        try {
            const data = await updateExercisePlan(plan);
            setPlan(data);
            setIsEditing(false);
        } catch (e) {
            setErr(e.message);
        } finally {
            setSaving(false);
        }
    }

    const updateDay = (dayIndex, field, value) => {
        const newPlan = { ...plan };
        newPlan.weekly_plan[dayIndex][field] = value;
        setPlan(newPlan);
    };

    const updateExercise = (dayIndex, exIndex, field, value) => {
        const newPlan = { ...plan };
        newPlan.weekly_plan[dayIndex].exercises[exIndex][field] = value;
        setPlan(newPlan);
    };

    if (loading && !plan) {
        return (
            <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin w-10 h-10 text-brand-purple mx-auto mb-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    <p className="text-gray-500 animate-pulse">Loading your fitness plan...</p>
                </div>
            </div>
        );
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
                    <span className="text-gray-500 text-sm hidden md:block">{user?.email}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Exercise Plan</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            AI-generated or personalized weekly workout plan
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {plan && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit Plan
                            </button>
                        )}
                        {isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 text-gray-500 font-medium hover:text-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2.5 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm shadow-brand-purple/20"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        )}
                        {!isEditing && (
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-6 py-2.5 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-xl font-medium hover:bg-brand-purple/20 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading ? 'Generating...' : 'Regenerate with AI'}
                            </button>
                        )}
                    </div>
                </div>

                {err && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {err}
                    </div>
                )}

                {plan ? (
                    <div className="space-y-6">
                        {/* Summary cards (not editable as they depend on the plan) */}
                        {!isEditing && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-medium">BMI</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.bmi?.toFixed(1) || '—'}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-medium">Workout Days</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.total_workout_days || 0}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-medium">Rest Days</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.rest_days || 0}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-medium">Weekly Calories</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.weekly_summary?.estimated_weekly_calories_burned || 0}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
                                </div>
                            </div>
                        )}

                        {/* Weekly plan */}
                        <div className="space-y-4">
                            {plan.weekly_plan?.map((day, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                                    <div className={`bg-gradient-to-r ${dayColors[i % dayColors.length]} px-6 py-4`}>
                                        <div className="flex justify-between items-center">
                                            {isEditing ? (
                                                <input
                                                    className="bg-white/20 text-white font-semibold rounded px-2 py-1 outline-none focus:bg-white/30 placeholder:text-white/50 w-full max-w-md"
                                                    value={day.focus}
                                                    onChange={(e) => updateDay(i, 'focus', e.target.value)}
                                                />
                                            ) : (
                                                <h3 className="font-semibold text-white">{day.day} — {day.focus}</h3>
                                            )}
                                            <div className="flex gap-3 text-white/80 text-xs">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input className="bg-white/20 text-white w-12 rounded px-1 outline-none text-center" value={day.total_duration_minutes} onChange={e => updateDay(i, 'total_duration_minutes', Number(e.target.value))} /> min
                                                    </div>
                                                ) : (
                                                    <span>{day.total_duration_minutes} min</span>
                                                )}
                                                <span>{day.total_calories_burned} kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {day.exercises?.map((ex, j) => (
                                            <div key={j} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors">
                                                {isEditing ? (
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Exercise Name</label>
                                                            <input
                                                                className="w-full text-sm font-medium border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-purple"
                                                                value={ex.name}
                                                                onChange={e => updateExercise(i, j, 'name', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Instructions</label>
                                                            <input
                                                                className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-purple"
                                                                value={ex.instructions}
                                                                placeholder="Optional instructions..."
                                                                onChange={e => updateExercise(i, j, 'instructions', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 col-span-full">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Duration (min)</label>
                                                                <input type="number" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none" value={ex.duration_minutes} onChange={e => updateExercise(i, j, 'duration_minutes', Number(e.target.value))} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Sets</label>
                                                                <input type="number" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none" value={ex.sets} onChange={e => updateExercise(i, j, 'sets', Number(e.target.value))} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Reps</label>
                                                                <input type="number" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none" value={ex.reps} onChange={e => updateExercise(i, j, 'reps', Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{ex.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                                            <span className="font-semibold text-gray-600">{ex.duration_minutes} min</span>
                                                            {ex.sets ? ` · ${ex.sets} sets` : ''}
                                                            {ex.reps ? ` × ${ex.reps} reps` : ''}
                                                            {ex.instructions ? ` · ${ex.instructions}` : ''}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 flex-shrink-0 md:flex-col md:items-end">
                                                    {isEditing ? (
                                                        <div className="space-y-1 w-full text-right">
                                                            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Kcal</label>
                                                            <input type="number" className="w-16 text-xs text-right border border-gray-200 rounded px-2 py-1" value={ex.calories_burned_estimate} onChange={e => updateExercise(i, j, 'calories_burned_estimate', Number(e.target.value))} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs font-semibold text-gray-500">{ex.calories_burned_estimate} kcal</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-tighter ${intensityColor[ex.intensity] || 'bg-gray-50 text-gray-500'}`}>
                                                                {ex.intensity}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Safety notes & tips (simplified display, not editable for now to keep UI clean, but could be) */}
                        {!isEditing && (
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
                        )}
                    </div>
                ) : !loading && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Generate Your Exercise Plan</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Click the button top right to create a personalized fitness plan based on your profile.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
