import React, { useState } from 'react';
import { Search, Plus, User, Building2 } from 'lucide-react';
import { Profile } from '../types/profile';
import { useProfilesStore } from '../store/profilesStore';
import { useUserProfilesStore } from '../store/userProfilesStore';

interface ProfileSearchProps {
  currentProfileId: string;
  onConnect: (profile: Profile) => void;
  excludeProfiles?: string[];
  placeholder?: string;
}

function ProfileSearch({ currentProfileId, onConnect, excludeProfiles = [], placeholder = "Search profiles to connect..." }: ProfileSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchProfiles } = useProfilesStore();
  const { getSourceConnections, getDestinationConnections } = useUserProfilesStore();

  // Get all connected profile IDs to exclude them from search
  const sourceConnections = getSourceConnections(currentProfileId);
  const destinationConnections = getDestinationConnections(currentProfileId);
  const connectedProfileIds = [
    ...sourceConnections.map(conn => conn.sourceProfileId),
    ...destinationConnections.map(conn => conn.destinationProfileId),
    ...excludeProfiles
  ];

  const availableProfiles = searchProfiles(searchTerm).filter(profile => 
    profile.id !== currentProfileId && !connectedProfileIds.includes(profile.id)
  );

  const handleConnect = (profile: Profile) => {
    onConnect(profile);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>
      
      {isOpen && searchTerm && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
            {availableProfiles.length > 0 ? (
              availableProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleConnect(profile)}
                  className="flex items-center space-x-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                >
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {profile.type === 'person' ? (
                        <User className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Building2 className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-white font-medium truncate">
                        {profile.name}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm truncate">
                      {profile.description}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-green-400 flex-shrink-0" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-white/60">
                No profiles found matching "{searchTerm}"
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileSearch;