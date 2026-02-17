
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onToggle: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onSuccess, onToggle }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = mode === 'signup' 
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      const user = data.user;
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      onSuccess(user);
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-400/20 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full -ml-16 -mb-16"></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-lg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2.5"/></svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              {mode === 'login' 
                ? 'Sign in to access your prescriptions and orders' 
                : 'Join Swami Medical Store today'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur text-red-700 p-4 rounded-xl text-base font-semibold border border-red-200 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-base md:text-lg font-bold text-slate-800 mb-2.5">
                {mode === 'login' ? 'Username or Email' : 'Username'}
              </label>
              <input
                type="text"
                required
                placeholder={mode === 'login' ? 'Enter username' : 'Choose a username'}
                className="w-full px-4 py-3.5 md:py-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base md:text-lg font-medium placeholder-slate-400 transition-all"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-base md:text-lg font-bold text-slate-800 mb-2.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3.5 md:py-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base md:text-lg font-medium placeholder-slate-400 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-base md:text-lg font-bold text-slate-800 mb-2.5">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                className="w-full px-4 py-3.5 md:py-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base md:text-lg font-medium placeholder-slate-400 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-slate-400 disabled:to-slate-400 text-white py-4 md:py-5 rounded-lg font-bold text-lg md:text-xl shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M9 13l2 2 4-4"/></svg>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-slate-200">
            <p className="text-base md:text-lg text-slate-600 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={onToggle}
                className="ml-2 text-teal-600 font-bold hover:text-teal-700 hover:underline transition-colors text-base md:text-lg"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
