import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Clock, CheckCircle, DollarSign, Eye, EyeOff } from 'lucide-react';
import { Connection } from '../types/connection';
import { Profile } from '../types/profile';
import { useProfilesStore } from '../store/profilesStore';
import { useUserProfilesStore } from '../store/userProfilesStore';

interface ConnectionCardProps {
  connection: Connection;
  currentProfileId: string;
  type: 'source' | 'destination';
}

function ConnectionCard({ connection, currentProfileId, type }: ConnectionCardProps) {
  const { getProfileById: getGlobalProfile } = useProfilesStore();
  const { getProfileById: getUserProfile } = useUserProfilesStore();
  
  const isSource = type === 'source';
  const otherProfileId = isSource ? connection.sourceProfileId : connection.destinationProfileId;
  const otherProfile = getUserProfile(otherProfileId) || getGlobalProfile(otherProfileId);
  
  if (!otherProfile) return null;

  const getConnectionTypeColor = (connType: string) => {
    switch (connType) {
      case 'owner': return 'bg-green-500/20 text-green-300';
      case 'affiliate': return 'bg-blue-500/20 text-blue-300';
      case 'partner': return 'bg-purple-500/20 text-purple-300';
      case 'other': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-start space-x-4">
        <Link to={`/profile/${otherProfile.id}`} className="flex-shrink-0">
          <img 
            src={otherProfile.image} 
            alt={otherProfile.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20 hover:border-white/40 transition-colors"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {otherProfile.type === 'person' ? (
              <User className="w-4 h-4 text-blue-400" />
            ) : (
              <Building2 className="w-4 h-4 text-purple-400" />
            )}
            <Link 
              to={`/profile/${otherProfile.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:text-blue-300 transition-colors truncate"
            >
              {otherProfile.name}
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConnectionTypeColor(connection.type)}`}>
              {connection.type}
            </span>
            
            <div className="flex items-center space-x-1">
              {connection.status === 'approved' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-400" />
              )}
              <span className={`text-xs ${connection.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                {connection.status}
              </span>
            </div>
          </div>
          
          <p className="text-white/60 text-sm mb-3 line-clamp-2">
            {otherProfile.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-white/60">
              <span>Connected {formatDate(connection.createdAt)}</span>
              <div className="flex items-center space-x-3">
                {connection.public ? (
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>Public</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <EyeOff className="w-3 h-3" />
                    <span>Private</span>
                  </span>
                )}
                {connection.showNet && (
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-green-400" />
                    <span>Show Net</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">
                {formatCurrency(connection.net)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionCard;