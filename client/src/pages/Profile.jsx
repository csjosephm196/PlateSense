import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getMe, updateProfile } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    height_cm: '',
    weight_kg: '',
    age: '',
    gender: '',
    diabetes_type: 'Type 2',
    insulin_to_carb_ratio: 10,
    baseline_glucose_range: '4-7',
    dietary_restriction: 'None',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMe().then((u) => {
      setForm({
        height_cm: u.height_cm ?? '',
        weight_kg: u.weight_kg ?? '',
        age: u.age ?? '',
        gender: u.gender ?? '',
        diabetes_type: u.diabetes_type ?? 'Type 2',
        insulin_to_carb_ratio: u.insulin_to_carb_ratio ?? 10,
        baseline_glucose_range: u.baseline_glucose_range ?? '4-7',
        dietary_restriction: u.dietary_restriction ?? 'None',
      });
    });
  }, []);

  function update(f) {
    setForm((prev) => ({ ...prev, ...f }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    try {
      await updateProfile({
        ...form,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        age: form.age ? Number(form.age) : null,
      });
      setSaved(true);
    } catch { }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-brand-purple font-semibold hover:text-brand-purple-dark">← Dashboard</Link>
        <span className="text-slate-500 text-sm">{user?.email}</span>
      </nav>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diabetes type</label>
            <select
              value={form.diabetes_type}
              onChange={(e) => update({ diabetes_type: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            >
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Insulin-to-carb ratio</label>
            <input
              type="number"
              value={form.insulin_to_carb_ratio}
              onChange={(e) => update({ insulin_to_carb_ratio: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baseline glucose range (mmol/L)</label>
            <input
              type="text"
              placeholder="e.g. 4-7"
              value={form.baseline_glucose_range}
              onChange={(e) => update({ baseline_glucose_range: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) => update({ height_cm: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={form.weight_kg}
                onChange={(e) => update({ weight_kg: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update({ age: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => update({ gender: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dietary restriction</label>
            <select
              value={form.dietary_restriction}
              onChange={(e) => update({ dietary_restriction: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            >
              <option value="None">None</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Halal">Halal</option>
              <option value="Kosher">Kosher</option>
            </select>
          </div>
          {saved && <p className="text-brand-purple text-sm font-medium">Profile saved.</p>}
          <button type="submit" className="w-full py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark transition-colors">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
