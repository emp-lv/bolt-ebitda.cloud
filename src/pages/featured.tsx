import React from 'react';
import { TrendingUp, Users, Building2, Star, ArrowLeft, User, Target, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ProfileCard from '../components/profileCard';
import { useProfilesStore } from '../store/profilesStore';

function Featured() {
  const { getPublicProfiles, getFeaturedProfiles } = useProfilesStore();
  const allProfiles = getPublicProfiles();
  const featuredProfiles = getFeaturedProfiles().slice(0, 3);
  const totalTargetMrr = allProfiles.reduce((sum, p) => sum + p.targetMrr, 0);
  const totalProfiles = allProfiles.length;
  const personProfiles = allProfiles.filter(p => p.type === 'person').length;
  const companyProfiles = allProfiles.filter(p => p.type === 'company').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCompanyTypeColor = (companyType?: string) => {
    switch (companyType) {
      case 'SaaS': return 'bg-blue-100 text-blue-800';
      case 'Agency': return 'bg-purple-100 text-purple-800';
      case 'Retail': return 'bg-green-100 text-green-800';
      case 'Royalties': return 'bg-yellow-100 text-yellow-800';
      case 'Newsletter': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
                <h1 className="text-6xl font-bold text-white mb-6">
                  Featured Revenue Streams
                </h1>
                <p className="text-xl text-white/80 max-w-3xl">
                  Discover how successful entrepreneurs and businesses transparently share their revenue streams and build trust with their audience.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ${totalTargetMrr.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Total Target MRR</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{totalProfiles}</div>
                <div className="text-sm text-white/60">Active Profiles</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{personProfiles}</div>
                <div className="text-sm text-white/60">Personal Profiles</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{companyProfiles}</div>
                <div className="text-sm text-white/60">Company Profiles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Highlights Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-5xl font-bold text-white">Top Performers</h2>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              These revenue streams showcase exceptional transparency and growth, inspiring others in the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProfiles.map((profile, index) => (
              <div key={profile.id} className="relative">
                {/* Featured Badge */}
                <div className="absolute -top-4 -right-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    #{index + 1} Featured
                  </div>
                </div>
                
                {/* Enhanced Card with Glow Effect */}
                <div className="transform hover:scale-105 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg blur-xl"></div>
                  <div className="relative">
                    <ProfileCard profile={profile} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Revenue Streams Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              All Revenue Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the complete collection of transparent revenue streams from entrepreneurs and businesses worldwide.
            </p>
          </div>
          
          {/* Condensed List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <div className="col-span-4">Profile</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Target MRR</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-2">Created</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {allProfiles.map((profile) => {
                const currentMrr = Math.floor(profile.targetMrr * (0.3 + Math.random() * 0.6));
                const progressPercentage = (currentMrr / profile.targetMrr) * 100;
                
                return (
                  <Link
                    key={profile.id}
                    to={`/profile/${profile.id}`}
                    className="block hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Profile Info */}
                        <div className="col-span-4 flex items-center space-x-3">
                          <img 
                            src={profile.image} 
                            alt={profile.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              {profile.type === 'person' ? (
                                <User className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Building2 className="w-4 h-4 text-purple-500" />
                              )}
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {profile.name}
                              </h3>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {profile.description}
                            </p>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-2">
                          {profile.companyType ? (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCompanyTypeColor(profile.companyType)}`}>
                              {profile.companyType}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {profile.type === 'person' ? 'Personal' : 'Company'}
                            </span>
                          )}
                        </div>

                        {/* Target MRR */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(profile.targetMrr)}
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="col-span-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                {formatCurrency(currentMrr)}
                              </span>
                              <span className="text-gray-500">
                                {progressPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(profile.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Share Your Revenue Stream?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join the transparency movement and build trust with your audience by showcasing your business revenue streams.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Create Your Profile
              </button>
              <Link 
                to="/"
                className="text-blue-600 hover:text-blue-700 font-semibold px-8 py-3 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Featured;