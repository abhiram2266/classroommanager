import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, Loader, Eye, EyeOff, Chrome } from 'lucide-react';
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

  const validate = () => {
    if (!displayName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Fill in all fields');
      return false;
    }
    if (displayName.length < 2) {
      setError('Name must be 2+ characters');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be 6+ characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email');
      return false;
    }
    return true;
  };

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Failed';\n    if (msg.includes('email-already-in-use')) setError('Email already registered. Login instead.');\n    else if (msg.includes('invalid-email')) setError('Invalid email');\n    else if (msg.includes('weak-password')) setError('Password too weak');\n    else if (msg.includes('popup-blocked')) setError('Pop-up blocked. Enable pop-ups.');\n    else if (msg.includes('popup-closed')) setError('Sign up cancelled');\n    else setError(msg);\n  };\n\n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setError(null);\n    if (!validate()) return;\n    setLoading(true);\n    try {\n      await signUp(email, password, displayName);\n      navigate('/');\n    } catch (err) {\n      handleError(err);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  const handleGoogleSignIn = async () => {\n    setError(null);\n    setLoading(true);\n    try {\n      await signInWithGoogle();\n      navigate('/');\n    } catch (err) {\n      handleError(err);\n    } finally {\n      setLoading(false);\n    }\n  };
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak', color: 'text-red-400' };
    if (password.length < 10) return { label: 'Fair', color: 'text-yellow-400' };
    return { label: 'Strong', color: 'text-green-400' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-black pt-20 pb-8 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-8">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <UserPlus className="w-8 h-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-white">Sign Up</h1>
            </div>
            <p className="text-gray-400">Create your College Hub account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="w-full bg-black border border-yellow-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
              />
            </div>

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
              {strength.label && <p className={`text-xs mt-2 ${strength.color}`}>Strength: {strength.label}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Confirm</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
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
                Signing up...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Sign up with Google
              </>
            )}
          </button>

          <div className="my-6 border-t border-gray-600"></div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-600 hover:text-yellow-500 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
