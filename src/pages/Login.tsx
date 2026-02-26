import { useState } from 'react';
import { useStore } from '../store';
import { Wallet, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { login } = useStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(identifier.trim(), password);
      setLoading(false);
      if (result.success) {
        const store = useStore.getState();
        if (store.currentUser?.role === 'admin') {
          onNavigate('admin-dashboard');
        } else {
          onNavigate('dashboard');
        }
      } else {
        setError(result.message);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Payflow</h1>
          <p className="text-primary-200 mt-1 text-sm">P2P Payment Simulation System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username, Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your identifier"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all pr-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')} className="text-primary-600 font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Demo Credentials</span>
            </div>
            <div className="space-y-1 text-xs text-amber-700">
              <p><strong>User:</strong> john_doe / password123</p>
              <p><strong>Admin:</strong> admin / admin123</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setIdentifier('john_doe'); setPassword('password123'); }}
                className="flex-1 text-xs py-2 bg-amber-200 hover:bg-amber-300 rounded-lg font-medium text-amber-800 transition-colors"
              >
                Fill User
              </button>
              <button
                onClick={() => { setIdentifier('admin'); setPassword('admin123'); }}
                className="flex-1 text-xs py-2 bg-amber-200 hover:bg-amber-300 rounded-lg font-medium text-amber-800 transition-colors"
              >
                Fill Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-primary-200 text-xs mt-6">
          ⚠️ This is a simulation system. No real money is involved.
        </p>
      </div>
    </div>
  );
}
