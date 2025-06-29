import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/navbar';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { signIn, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="py-8">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <LogIn className="w-8 h-8 text-blue-400" />
                  <h1 className="text-4xl font-bold text-white">Sign In</h1>
                </div>
                <p className="text-lg text-white/80">
                  Welcome back! Sign in to access your revenue transparency dashboard.
                </p>
              </div>
            </div>

            {/* Sign In Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 mb-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm">Remember me</span>
                  </label>
                  
                  <Link
                    to="/reset-password"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">What you'll get access to:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Create unlimited revenue stream profiles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Connect with other transparent businesses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Beautiful interactive revenue visualizations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Analytics and insights dashboard</span>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mb-8">
              <p className="text-white/60 text-sm">
                Join thousands of entrepreneurs building trust through transparency
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;