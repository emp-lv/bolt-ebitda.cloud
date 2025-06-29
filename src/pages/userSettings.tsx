import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Shield, Trash2, Plus, Building2, TrendingUp, DollarSign, Eye, EyeOff, Globe, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import { useAuth } from '../hooks/useAuth';
import { useUserProfilesStore } from '../store/userProfilesStore';
import { Profile } from '../types/profile';

function UserSettings() {
  const { user: currentUser } = useAuth();
  const { userProfiles, getSourceConnections, getDestinationConnections } = useUserProfilesStore();
  const [activeTab, setActiveTab] = useState<'account' | 'profiles' | 'privacy'>('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate total revenue across all profiles
  const calculateTotalRevenue = () => {
    let totalRevenue = 0;
    userProfiles.forEach(profile => {
      const sourceConnections = getSourceConnections(profile.id);
      const profileRevenue = sourceConnections.reduce((sum, conn) => sum + conn.net, 0);
      totalRevenue += profileRevenue;
    });
    return totalRevenue;
  };

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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProfileRevenue = (profile: Profile) => {
    const sourceConnections = getSourceConnections(profile.id);
    return sourceConnections.reduce((sum, conn) => sum + conn.net, 0);
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'profiles', name: 'My Profiles', icon: <Building2 className="w-4 h-4" /> },
    { id: 'privacy', name: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />

      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="py-8">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3 mb-8">
              <SettingsIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">User Settings</h1>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(calculateTotalRevenue())}
                </span>
              </div>
              <p className="text-white/60 text-sm">Total Revenue Across All Profiles</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">{userProfiles.length}</span>
              </div>
              <p className="text-white/60 text-sm">Active Profiles</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <User className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  {userProfiles.filter(p => p.type === 'person').length}
                </span>
              </div>
              <p className="text-white/60 text-sm">Personal Profiles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                    
                    <div className="space-y-6">
                      {/* User Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={currentUser?.name || ''}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                            <input
                              type="email"
                              value={currentUser?.email || ''}
                              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Account Created */}
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Account Created
                        </label>
                        <div className="flex items-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60">
                          <User className="w-4 h-4" />
                          <span>
                            {currentUser ? formatDate(currentUser.createdAt) : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Password & Security</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                              <input
                                type="password"
                                placeholder="Enter current password"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* OAuth Section */}
                      <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">G</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">Google</p>
                                <p className="text-white/60 text-sm">Not connected</p>
                              </div>
                            </div>
                            <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                              Connect
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">G</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">GitHub</p>
                                <p className="text-white/60 text-sm">Not connected</p>
                              </div>
                            </div>
                            <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-6">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profiles Tab */}
                {activeTab === 'profiles' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">My Profiles</h2>
                      <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Create Profile</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {userProfiles.map((profile) => {
                        const revenue = getProfileRevenue(profile);
                        const sourceConnections = getSourceConnections(profile.id);
                        const destinationConnections = getDestinationConnections(profile.id);
                        
                        return (
                          <div key={profile.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <img 
                                  src={profile.image} 
                                  alt={profile.name}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {profile.type === 'person' ? (
                                      <User className="w-4 h-4 text-blue-400" />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-purple-400" />
                                    )}
                                    <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                                    {profile.companyType && (
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                        {profile.companyType}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/70 text-sm mb-3">{profile.description}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="w-4 h-4 text-green-400" />
                                      <span className="text-white/80">Revenue: {formatCurrency(revenue)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <TrendingUp className="w-4 h-4 text-blue-400" />
                                      <span className="text-white/80">Target: {formatCurrency(profile.targetMrr)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Globe className="w-4 h-4 text-purple-400" />
                                      <span className="text-white/80">
                                        {sourceConnections.length + destinationConnections.length} connections
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/profile/${profile.id}`}
                                  className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                                >
                                  View
                                </Link>
                                <Link
                                  to={`/profile/${profile.id}/edit`}
                                  className="text-green-400 hover:text-green-300 font-medium text-sm"
                                >
                                  Edit
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
                    
                    <div className="space-y-8">
                      {/* Privacy Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <h4 className="text-white font-medium">Profile Discovery</h4>
                              <p className="text-white/60 text-sm">Allow others to find your profiles in search</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <h4 className="text-white font-medium">Email Notifications</h4>
                              <p className="text-white/60 text-sm">Receive emails about connection requests and updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <h4 className="text-white font-medium">Analytics Tracking</h4>
                              <p className="text-white/60 text-sm">Help improve the platform with anonymous usage data</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Data Export */}
                      <div className="border-t border-white/10 pt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-medium mb-2">Export Your Data</h4>
                            <p className="text-white/60 text-sm mb-4">
                              Download a copy of all your profile data, connections, and settings.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Request Data Export
                            </button>
                          </div>
                          
                          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                              <Trash2 className="w-4 h-4 text-red-400" />
                              <span>Delete Account</span>
                            </h4>
                            <p className="text-white/60 text-sm mb-4">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button 
                              onClick={() => setShowDeleteConfirm(true)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-gray-900 rounded-lg border border-white/20 p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Account Deletion</h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to delete your account? This will permanently remove all your profiles, 
              connections, and data. This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle account deletion
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;