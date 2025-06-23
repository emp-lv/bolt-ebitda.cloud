import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, DollarSign, Settings, Package } from 'lucide-react';
import { Profile } from '../types/profile'

interface NavbarProps {
  profile?: Profile;
  showEditButton?: boolean;
}

function Navbar({ profile, showEditButton = false }: NavbarProps) {
  return (
    <nav className="w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors"
            >
              <DollarSign className="w-6 h-6" />
              <span className="font-semibold text-lg">My Earnings</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/product" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Product</span>
            </Link>
            
            {profile && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{profile.name}</span>
                </div>
                
                {showEditButton && (
                  <Link 
                    to={`/profile/${profile.id}/edit`}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;