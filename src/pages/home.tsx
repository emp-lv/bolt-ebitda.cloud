import React from 'react';
import { TrendingUp, Users, Building2 } from 'lucide-react';
import Navbar from '../components/navbar';
import ProfileCard from '../components/profileCard';
import { profiles } from '../data/profiles';

function Home() {
  const totalProfiles = profiles.length;
  const personProfiles = profiles.filter(p => p.type === 'person').length;
  const companyProfiles = profiles.filter(p => p.type === 'company').length;
  const totalTargetMrr = profiles.reduce((sum, p) => sum + p.targetMrr, 0);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-16">
            <h1 className="text-6xl font-bold text-white mb-6">
              My Earnings Online
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Track and visualize your revenue streams across multiple profiles and business ventures
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
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
          
          {/* Profiles Grid */}
          <div className="pb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Revenue Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;