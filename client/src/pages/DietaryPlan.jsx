import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getDietaryPlan } from '../services/api';

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
    const [error, setError] = useState('');

    async function handleGenerate() {
        setLoading(true);
        setError('');
        setPlan(null);
        try {
            const data = await getDietaryPlan();
            setPlan(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                    <span className="text-gray-500 text-sm">{user?.email}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dietary Plan</h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            AI-generated weekly meal plan following FDA guidelines
                            {plan?.dietary_restriction && plan.dietary_restriction !== 'None' && (
                                <span className="ml-2 inline-block px-2 py-0.5 bg-brand-purple/10 text-brand-purple text-xs rounded-full font-medium">{plan.dietary_restriction}</span>
                            )}
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
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
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
                        {/* Targets */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Daily Calorie Target</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.daily_calorie_target}<span className="text-sm font-normal text-gray-400 ml-1">kcal</span></p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Daily Carb Target</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.daily_carb_target_g}<span className="text-sm font-normal text-gray-400 ml-1">g</span></p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-medium">Dietary Restriction</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{plan.dietary_restriction || 'None'}</p>
                            </div>
                        </div>

                        {/* Weekly plan */}
                        <div className="space-y-4">
                            {plan.weekly_plan?.map((day, i) => (
                                <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className={`bg-gradient-to-r ${dayColors[i % dayColors.length]} px-6 py-3`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-white">{day.day}</h3>
                                            {day.daily_totals && (
                                                <div className="flex gap-4 text-white/80 text-xs">
                                                    <span>{day.daily_totals.calories} kcal</span>
                                                    <span>{day.daily_totals.carbs_g}g carbs</span>
                                                    <span>{day.daily_totals.protein_g}g protein</span>
                                                    <span>{day.daily_totals.fat_g}g fat</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {day.meals && Object.entries(day.meals).map(([mealType, meal]) => (
                                            <div key={mealType} className="px-6 py-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{mealIcons[mealType] || '🍽️'}</span>
                                                    <h4 className="text-sm font-semibold text-gray-900 capitalize">{mealType}</h4>
                                                    <span className="text-xs text-gray-400">— {meal.name}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">{meal.description}</p>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {meal.foods?.map((food, j) => (
                                                        <span key={j} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full border border-gray-100">{food}</span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-4">
                                                    <MacroPill label="Cal" value={meal.calories} unit="" color="bg-brand-purple" />
                                                    <MacroPill label="Carbs" value={meal.carbs_g} unit="g" color="bg-amber-500" />
                                                    <MacroPill label="Protein" value={meal.protein_g} unit="g" color="bg-blue-500" />
                                                    <MacroPill label="Fat" value={meal.fat_g} unit="g" color="bg-rose-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FDA guidelines & diabetes tips */}
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
                    </div>
                )}

                {!plan && !loading && !error && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Generate Your Dietary Plan</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Click the button above to create a personalized weekly meal plan based on FDA guidelines, your profile, and dietary restrictions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
