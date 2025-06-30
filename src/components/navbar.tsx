import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Euro, User, Settings, LogOut, ChevronDown, Info } from 'lucide-react';
import { Profile } from '../types/profile';
import { useAuth } from '../hooks/useAuth';
import LiquidGlass from './liquidGlass';

interface NavbarProps {
  profile?: Profile;
  showEditButton?: boolean;
  centerOnly?: boolean; // New prop for auth pages
}

function Navbar({ profile, showEditButton = false, centerOnly = false }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/pricing', label: 'Pricing', icon: <Euro className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  // For auth pages, show only centered main navigation
  if (centerOnly) {
    return (
      <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <LiquidGlass>
            <div className="flex items-center space-x-1 px-2 py-0.5">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-slate-600 hover:text-green-400 transition-colors px-3 py-1.5 rounded-lg"
                title="My Earnings"
              >
                <Euro className="w-4 h-4" />
                <span className="font-semibold text-sm hidden sm:block  text-slate-600">My Earnings</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-5 bg-white/20 mx-1" />

              {/* Navigation Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-white/20 text-slate-600'
                      : 'text-slate-600/70 hover:text-green-400 hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs hidden md:block">{item.label}</span>
                </Link>
              ))}
            </div>
          </LiquidGlass>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl pointer-events-none">
      <div className="flex items-center justify-between gap-3 pointer-events-none">
        {/* Main Navigation */}
        <div className="pointer-events-auto">
          <LiquidGlass>
          <div className="flex items-center space-x-1 px-2 py-0.5">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-slate-600 hover:text-green-400 transition-colors px-3 py-1.5 rounded-lg"
              title="My Earnings"
            >
              <Euro className="w-4 h-4" />
              <span className="font-semibold text-sm hidden sm:block text-slate-600">MyEarnings</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 mx-1" />

            {/* Navigation Items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-green-400/20 text-slate-600 hover:bg-green-400/10'
                    : 'text-slate-600/70 hover:bg-green-400/10'
                }`}
              >
                {item.icon}
                <span className="text-xs hidden md:block">{item.label}</span>
              </Link>
            ))}
          </div>
          </LiquidGlass>
        </div>

        {/* User Section */}
        <div className="pointer-events-auto">
          <LiquidGlass>
          <div className="flex items-center px-2 py-1.5">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={user.name}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-green-400/10 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium text-slate-600">{user.name}</div>
                      {user.isSponsor && (
                        <div className="text-[10px] text-yellow-300">Sponsor</div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-600/70" />
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-56 z-20">
                      <LiquidGlass>
                        <div className="p-1.5">
                          {/* User Info Header */}
                          <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs font-medium">{user.name}</div>
                                <div className="text-slate-600/60 text-[10px]">{user.email}</div>
                                {user.isSponsor && (
                                  <div className="inline-block px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-[10px] rounded-full mt-1">
                                    Sponsor
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Profile Links */}
                          {profile && (
                            <>
                              <Link
                                to={`/profile/${profile.id}`}
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-slate-600/70 hover:text-slate-600 text-xs"
                              >
                                <User className="w-3.5 h-3.5" />
                                <span>View Profile</span>
                              </Link>
                              
                              {showEditButton && (
                                <Link
                                  to={`/profile/${profile.id}/edit`}
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-slate-600/70 hover:text-slate-600 text-xs"
                                >
                                  <Settings className="w-3.5 h-3.5" />
                                  <span>Edit Profile</span>
                                </Link>
                              )}
                            </>
                          )}
                          
                          <Link
                            to="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-slate-600/70 hover:text-slate-600 text-xs"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>User Settings</span>
                          </Link>
                          
                          <div className="border-t border-white/10 my-1.5" />
                          
                          <button
                            onClick={() => {
                              signOut();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-slate-600/70 hover:text-slate-600 text-xs"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </LiquidGlass>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/signin"
                  title="Sign In / Sign Up"
                  className="flex items-center justify-center w-8 h-8 text-slate-600/70 hover:text-slate-600 transition-colors rounded-lg hover:bg-white/10"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
          </LiquidGlass>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;