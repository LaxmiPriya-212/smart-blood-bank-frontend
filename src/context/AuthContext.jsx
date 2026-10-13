import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing logged-in user
    try {
      const storedUser = localStorage.getItem('sbb_auth_user');
      const storedToken = localStorage.getItem('sbb_auth_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to parse cached auth state:', e);
      localStorage.removeItem('sbb_auth_user');
      localStorage.removeItem('sbb_auth_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (roleKey) => {
    setLoading(true);
    try {
      const res = await authService.demoLogin(roleKey);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated: Boolean(user),
    loading,
    login,
    demoLogin,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
