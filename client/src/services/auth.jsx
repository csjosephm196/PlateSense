import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (r.ok) return r.json();
          setToken(null);
          localStorage.removeItem('token');
          return null;
        })
        .then(setUser)
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
