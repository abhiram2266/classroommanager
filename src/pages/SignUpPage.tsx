import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Loader, Eye, EyeOff, CheckCircle, Chrome } from 'lucide-react';
import { signUp, signInWithGoogle } from '@/services/auth';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!displayName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return false;
    }

    if (displayName.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      if (errorMessage.includes('email-already-in-use')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (errorMessage.includes('invalid-email')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('weak-password')) {
        setError('Password is too weak. Use a stronger password.');
      } else {
        setError(errorMessage);
      }
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
      const errorMessage = err instanceof Error ? err.message : 'Google sign up failed';
      if (errorMessage.includes('popup-blocked')) {
        setError('Pop-up was blocked. Please enable pop-ups and try again.');
      } else if (errorMessage.includes('popup-closed')) {
        setError('Sign up was cancelled');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-400' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'text-yellow-400' };
    return { strength: 3, label: 'Strong', color: 'text-green-400' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-black pt-20 pb-8 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <UserPlus className="w-8 h-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-white">Sign Up</h1>
            </div>
            <p className="text-gray-400">Create your College Hub account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <p className={`text-xs mt-2 ${strength.color}`}>
                  Password strength: {strength.label}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-xs text-green-400">Passwords match</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-600"></div>
            <p className="text-xs text-gray-400">OR</p>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-600 hover:border-yellow-600 text-white font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Sign up with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-600 hover:text-yellow-500 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
