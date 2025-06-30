import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, KeyRound, CheckCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { resetPassword, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await resetPassword(email);
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative">
        <Navbar centerOnly={true} />

        <div className="bg-dark-gradient">
          <div className="px-4 sm:px-6 lg:px-8 bg-noise pt-16 pb-32">
            <div className="max-w-md mx-auto">
              <div className="py-8">
                <div className="text-center mb-8 pt-16">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-200" />
                    <h1 className="text-4xl font-bold text-accent">
                      Check Your Email
                    </h1>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-4">
                    Password Reset Email Sent
                  </h2>

                  <p className="text-white/80 mb-6 leading-relaxed">
                    We've sent a password reset link to{" "}
                    <strong className="text-white">{email}</strong>. Please
                    check your email and follow the instructions to reset your
                    password.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-300 text-sm">
                        <strong>Didn't receive the email?</strong> Check your
                        spam folder or try again in a few minutes.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Try Different Email
                    </button>

                    <Link
                      to="/signin"
                      className="block w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold text-center transition-all duration-300 transform hover:scale-105"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3 text-sm text-white/80">
                  <p>• The reset link will expire in 24 hours for security</p>
                  <p>• Make sure to check your spam/junk folder</p>
                  <p>• If you continue having issues, contact support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <KeyRound className="w-8 h-8 text-green-200" />
                  <h1 className="text-4xl font-bold text-accent">
                    Reset Password
                  </h1>
                </div>
                <p className="text-lg text-white/80">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>
            </div>

            {/* Reset Form */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-colors"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">
                    We'll send a password reset link to this email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-green-400/60 hover:bg-green-400/80 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>
                    {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                  </span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  Remember your password?{" "}
                  <Link
                    to="/signin"
                    className="text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Security Information
              </h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>
                    Reset links expire after 24 hours for your security
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Only the most recent reset link will be valid</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Your account remains secure during this process</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ResetPassword;
