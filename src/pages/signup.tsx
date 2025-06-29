import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/navbar';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const { signUp, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.agreeToTerms) {
      return;
    }
    
    const result = await signUp(formData.email, formData.password, formData.name);
    if (result.success) {
      navigate('/');
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

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
                  <UserPlus className="w-8 h-8 text-green-400" />
                  <h1 className="text-4xl font-bold text-white">Create Account</h1>
                </div>
                <p className="text-lg text-white/80">
                  Join the transparency movement and start building trust with your audience.
                </p>
              </div>
            </div>

            {/* Sign Up Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 mb-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center space-x-1 ${passwordStrength.length ? 'text-green-400' : 'text-white/60'}`}>
                          <Check className={`w-3 h-3 ${passwordStrength.length ? 'opacity-100' : 'opacity-30'}`} />
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.uppercase ? 'text-green-400' : 'text-white/60'}`}>
                          <Check className={`w-3 h-3 ${passwordStrength.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                          <span>Uppercase</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.lowercase ? 'text-green-400' : 'text-white/60'}`}>
                          <Check className={`w-3 h-3 ${passwordStrength.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                          <span>Lowercase</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${passwordStrength.number ? 'text-green-400' : 'text-white/60'}`}>
                          <Check className={`w-3 h-3 ${passwordStrength.number ? 'opacity-100' : 'opacity-30'}`} />
                          <span>Number</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-red-400 text-xs mt-2">Passwords do not match</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                      className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2 mt-1"
                      required
                    />
                    <span className="text-white/80 text-sm leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !passwordsMatch || !isPasswordStrong || !formData.agreeToTerms}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Why join My Earnings?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">100% free forever - no hidden costs or limitations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Build trust and credibility with your audience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Connect with other transparent entrepreneurs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">Beautiful revenue stream visualizations</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mb-8">
              <p className="text-white/60 text-sm mb-2">
                Trusted by entrepreneurs worldwide
              </p>
              <p className="text-white/40 text-xs">
                Your data is secure and encrypted. We never share your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;