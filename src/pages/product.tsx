import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  ArrowRight, 
  Play, 
  Eye, 
  Zap, 
  Shield, 
  BarChart3,
  Star,
  Mail,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ProfileCard from '../components/profileCard';
import { profiles } from '../data/profiles';

function Product() {
  const featuredProfiles = profiles.slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20 flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" style={{ height: '800px' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
                Visualize Your
                <br />
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              <p className="text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                The most beautiful and intuitive way to track, connect, and optimize your revenue streams across multiple business ventures with real-time particle visualizations
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-16">
                <Link
                  to={`/profile/${profiles[0].id}`}
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Play className="w-6 h-6" />
                  <span>See Live Demo</span>
                </Link>
                
                <button className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 border border-white/20 hover:border-white/40">
                  <Users className="w-6 h-6" />
                  <span>Start Free Trial</span>
                </button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
                  <div className="text-white/70">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">$50M+</div>
                  <div className="text-white/70">Revenue Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
                  <div className="text-white/70">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
                  <div className="text-white/70">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Revenue Streams Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Featured Revenue Streams
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how successful entrepreneurs and businesses use My Earnings to track and optimize their income sources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProfiles.map((profile) => (
                <div key={profile.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
              >
                <span>Explore All Revenue Streams</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Why Choose My Earnings?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for entrepreneurs who demand the best tools to visualize and optimize their financial success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Visualization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch your money flow in beautiful, interactive particle streams that update in real-time as your business grows and evolves.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage personal and business profiles separately, with clear connections between your various income sources and destinations.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get deep insights into your revenue patterns and optimize your income streams with intelligent recommendations and forecasting.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built with cutting-edge technology for instant updates and seamless performance, even with complex revenue networks.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank-level Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your financial data is protected with enterprise-grade encryption and security measures trusted by Fortune 500 companies.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Growth Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Identify opportunities for growth and optimization with AI-powered insights that help you maximize your revenue potential.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Loved by Entrepreneurs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of successful business owners who trust My Earnings to track their revenue streams
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Twitter-style testimonial 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-3 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-gray-900">Sarah Chen</div>
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">@sarahchen_tech</div>
                  </div>
                  <div className="text-gray-400 text-sm">2h</div>
                </div>
                <p className="text-gray-900 mb-4 leading-relaxed">
                  My Earnings transformed how I visualize my business. The particle streams make it so easy to see where my money is coming from and going to. It's like having a financial dashboard that's actually beautiful to look at. 🚀
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>24</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>89</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>312</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter-style testimonial 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-3 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Marcus Rodriguez"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-gray-900">Marcus Rodriguez</div>
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">@marcusbuilds</div>
                  </div>
                  <div className="text-gray-400 text-sm">4h</div>
                </div>
                <p className="text-gray-900 mb-4 leading-relaxed">
                  As someone managing multiple revenue streams, @MyEarnings is a game-changer. I can finally see the big picture of my financial ecosystem and make data-driven decisions about where to focus my energy. 💰📊
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>18</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>156</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>428</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter-style testimonial 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-3 mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Emily Watson"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-gray-900">Emily Watson</div>
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">@emilywatson_co</div>
                  </div>
                  <div className="text-gray-400 text-sm">6h</div>
                </div>
                <p className="text-gray-900 mb-4 leading-relaxed">
                  The visual approach to financial tracking is revolutionary. My team and I can instantly understand our revenue flows, and the real-time updates keep us all aligned on our financial goals. ✨🎯
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>42</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>203</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>567</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section Placeholder */}
        <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-gray-900 to-blue-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                Join thousands of entrepreneurs who trust My Earnings to visualize and optimize their revenue streams
              </p>
              
              <div className="flex items-center justify-center space-x-6">
                <button className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <Users className="w-7 h-7" />
                  <span>Start Free Today</span>
                </button>
                
                <Link
                  to={`/profile/${profiles[0].id}`}
                  className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  <Play className="w-7 h-7" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Product;