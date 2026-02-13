import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Loader, Eye, EyeOff, Chrome } from 'lucide-react';
import { logIn, signInWithGoogle } from '@/services/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Failed';
    if (msg.includes('user-not-found')) setError('No account found');
    else if (msg.includes('wrong-password')) setError('Incorrect password');
    else if (msg.includes('invalid-email')) setError('Invalid email');
    else if (msg.includes('popup-blocked')) setError('Pop-up blocked. Enable pop-ups.');
    else if (msg.includes('popup-closed')) setError('Sign in cancelled');
    else setError(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be 6+ characters');
      return;
    }

    setLoading(true);
    try {
      await logIn(email, password);
      navigate('/');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-8 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <LogIn className="w-8 h-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-white">Login</h1>
            </div>
            <p className="text-gray-400">Welcome back to College Hub</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-600"></div>
            <p className="text-xs text-gray-400">OR</p>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-600 hover:border-yellow-600 text-white font-semibold rounded flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Sign in with Google
              </>
            )}
          </button>

          <div className="my-6 border-t border-gray-600"></div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-yellow-600 hover:text-yellow-500 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
