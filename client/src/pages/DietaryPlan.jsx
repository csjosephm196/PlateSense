import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getDietaryPlan, generateDietaryPlan, updateDietaryPlan } from '../services/api';

const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snacks: '🍎',
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

export default function DietaryPlan() {
    const { user } = useAuth();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        getDietaryPlan()
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
            const data = await generateDietaryPlan();
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
            const data = await updateDietaryPlan(plan);
            setPlan(data);
            setIsEditing(false);
        } catch (e) {
            setErr(e.message);
        } finally {
            setSaving(false);
        }
    }

    const updatePlanField = (field, value) => {
        setPlan({ ...plan, [field]: value });
    };

    const updateMeal = (dayIndex, mealType, field, value) => {
        const newPlan = { ...plan };
        newPlan.weekly_plan[dayIndex].meals[mealType][field] = value;
        setPlan(newPlan);
    };

    if (loading && !plan) {
        return (
            <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin w-10 h-10 text-brand-purple mx-auto mb-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    <p className="text-gray-500 animate-pulse">Loading your dietary plan...</p>
                </div>
            </div>
        );
    }

    function MacroPill({ label, value, unit, color }) {
        return (
            <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-gray-500">{label}: <span className="font-semibold text-gray-700">{value}{unit}</span></span>
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
                        <Link to="/exercise-plan" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Exercise Plan</Link>
                        <Link to="/dietary-plan" className="text-sm text-brand-purple font-medium">Dietary Plan</Link>
                        <Link to="/profile" className="text-sm text-gray-500 hover:text-brand-purple font-medium transition-colors">Profile</Link>
                    </div>
                    <span className="text-gray-500 text-sm hidden md:block">{user?.email}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dietary Plan</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            AI-generated or personalized weekly meal plan
                            {plan?.dietary_restriction && plan.dietary_restriction !== 'None' && (
                                <span className="ml-2 inline-block px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-xs rounded-full font-medium">{plan.dietary_restriction}</span>
                            )}
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
                        {/* Targets */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium font-bold uppercase tracking-wider">Daily Calorie Target</span>
                                {isEditing ? (
                                    <input type="number" className="w-full text-2xl font-bold bg-gray-50 rounded px-2 py-1 mt-1 outline-none text-brand-purple" value={plan.daily_calorie_target} onChange={e => updatePlanField('daily_calorie_target', Number(e.target.value))} />
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.daily_calorie_target}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
                                )}
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium font-bold uppercase tracking-wider">Daily Carb Target</span>
                                {isEditing ? (
                                    <input type="number" className="w-full text-2xl font-bold bg-gray-50 rounded px-2 py-1 mt-1 outline-none text-brand-purple" value={plan.daily_carb_target_g} onChange={e => updatePlanField('daily_carb_target_g', Number(e.target.value))} />
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{plan.daily_carb_target_g}<span className="text-sm font-normal text-gray-400 ml-1">g</span></p>
                                )}
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium font-bold uppercase tracking-wider">Dietary Restriction</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.dietary_restriction || 'None'}</p>
                            </div>
                        </div>

                        {/* Weekly plan */}
                        <div className="space-y-4">
                            {plan.weekly_plan?.map((day, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className={`bg-gradient-to-r ${dayColors[i % dayColors.length]} px-6 py-4`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-white">{day.day}</h3>
                                            {!isEditing && day.daily_totals && (
                                                <div className="flex gap-4 text-white/80 text-xs">
                                                    <span>{day.daily_totals.calories} kcal</span>
                                                    <span>{day.daily_totals.carbs_g}g carbs</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {day.meals && Object.entries(day.meals).map(([mealType, meal]) => (
                                            <div key={mealType} className="px-6 py-5 bg-white hover:bg-gray-50/30 transition-colors">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">{mealIcons[mealType] || '🍽️'}</span>
                                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tighter">{mealType}</h4>
                                                    </div>
                                                    {!isEditing && (
                                                        <div className="flex gap-3">
                                                            <MacroPill label="Cal" value={meal.calories} unit="" color="bg-brand-purple" />
                                                            <MacroPill label="Carbs" value={meal.carbs_g} unit="g" color="bg-amber-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            className="w-full text-sm font-semibold border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-purple"
                                                            value={meal.name}
                                                            placeholder="Meal name"
                                                            onChange={e => updateMeal(i, mealType, 'name', e.target.value)}
                                                        />
                                                        <textarea
                                                            className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-purple resize-none"
                                                            rows={2}
                                                            value={meal.description}
                                                            placeholder="Description..."
                                                            onChange={e => updateMeal(i, mealType, 'description', e.target.value)}
                                                        />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Calories</label>
                                                                <input type="number" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" value={meal.calories} onChange={e => updateMeal(i, mealType, 'calories', Number(e.target.value))} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Carbs (g)</label>
                                                                <input type="number" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" value={meal.carbs_g} onChange={e => updateMeal(i, mealType, 'carbs_g', Number(e.target.value))} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-sm font-medium text-gray-900 mb-1">{meal.name}</p>
                                                        <p className="text-xs text-gray-500 leading-relaxed mb-3">{meal.description}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {meal.foods?.map((food, j) => (
                                                                <span key={j} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100 font-medium font-bold">{food}</span>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Notes (Read-only for now) */}
                        {!isEditing && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {plan.fda_guidelines_notes?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            </div>
                                            <h4 className="text-sm font-semibold text-gray-900">FDA Guidelines</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {plan.fda_guidelines_notes.map((n, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                    {n}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {plan.diabetes_specific_tips?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            </div>
                                            <h4 className="text-sm font-semibold text-gray-900">Diabetes Tips</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {plan.diabetes_specific_tips.map((t, i) => (
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
                            <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Generate Your Dietary Plan</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Click the button top right to create a personalized meal plan based on your profile and dietary restrictions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
