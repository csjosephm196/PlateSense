import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    diabetes_type: 'Type 2',
    insulin_to_carb_ratio: 10,
    height_cm: '',
    weight_kg: '',
    age: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  function update(f) {
    setForm((prev) => ({ ...prev, ...f }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token } = await register({
        ...form,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        age: form.age ? Number(form.age) : null,
      });
      setAuth(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50/30 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <Link to="/" className="text-xl font-bold text-slate-900 mb-2 block">
          Plate<span className="text-brand-purple">Sense</span>
        </Link>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            required
          />
          <select
            value={form.diabetes_type}
            onChange={(e) => update({ diabetes_type: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
          >
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
          </select>
          <input
            type="number"
            placeholder="Insulin-to-carb ratio"
            value={form.insulin_to_carb_ratio}
            onChange={(e) => update({ insulin_to_carb_ratio: Number(e.target.value) || 10 })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Height (cm)"
              value={form.height_cm}
              onChange={(e) => update({ height_cm: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={form.weight_kg}
              onChange={(e) => update({ weight_kg: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => update({ age: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            />
            <select
              value={form.gender}
              onChange={(e) => update({ gender: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-brand-purple text-white rounded-xl font-medium hover:bg-brand-purple-dark transition-colors">
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-purple font-medium hover:text-brand-purple-dark">Login</Link>
        </p>
      </div>
    </div>
  );
}
