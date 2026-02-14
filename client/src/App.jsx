import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './services/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MobileUpload from './pages/MobileUpload';
import ExercisePlan from './pages/ExercisePlan';
import DietaryPlan from './pages/DietaryPlan';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
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
            <ExercisePlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dietary-plan"
        element={
          <ProtectedRoute>
            <DietaryPlan />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
