import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './services/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MobileUpload from './pages/MobileUpload';

// Lazy-load heavy pages so they don't crash the main app
const ExercisePlan = lazy(() => import('./pages/ExercisePlan'));
const DietaryPlan = lazy(() => import('./pages/DietaryPlan'));
const BrainHealth = lazy(() => import('./pages/BrainHealth'));

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin w-8 h-8 text-brand-purple mx-auto mb-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function LazyRoute({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload/:sessionId" element={<MobileUpload />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercise-plan"
        element={
          <ProtectedRoute>
            <LazyRoute><ExercisePlan /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dietary-plan"
        element={
          <ProtectedRoute>
            <LazyRoute><DietaryPlan /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/brain-health"
        element={
          <ProtectedRoute>
            <LazyRoute><BrainHealth /></LazyRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload/:sessionId" element={<MobileUpload />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/exercise-plan" element={<ProtectedRoute><ExercisePlan /></ProtectedRoute>} />
        <Route path="/dietary-plan" element={<ProtectedRoute><DietaryPlan /></ProtectedRoute>} />
        <Route path="/brain-health" element={<ProtectedRoute><BrainHealth /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
