import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signIn, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn(formData.email, formData.password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar centerOnly={true} />

      <div className="bg-dark-gradient">
        <div className="px-4 sm:px-6 lg:px-8 bg-noise pt-16 pb-32">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="py-8">
              <div className="text-center mb-8 pt-16">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <LogIn className="w-8 h-8 text-green-200" />
                  <h1 className="text-4xl font-bold text-accent">Sign In</h1>
                </div>
                <p className="text-lg text-white/80">
                  Welcome back! Sign in to access your revenue transparency
                  dashboard.
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-colors"
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
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-400 bg-white/5 border-white/20 rounded focus:ring-green-400 focus:ring-2"
                    />
                    <span className="text-white/80 text-sm">Remember me</span>
                  </label>

                  <Link
                    to="/reset-password"
                    className="text-green-200 hover:text-green-300 text-sm transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-400/80 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-green-200 hover:text-green-300 font-medium transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SignIn;
