import React from 'react';
import styled from 'styled-components';
import { User, Building2, Calendar, Target } from 'lucide-react';
import { Profile } from '../types/profile';

interface ProfileTooltipContentProps {
  profile: Profile;
}

function ProfileTooltipContent({ profile }: ProfileTooltipContentProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentMrr = Math.floor(profile.targetMrr * (0.3 + Math.random() * 0.6));
  const progressPercentage = (currentMrr / profile.targetMrr) * 100;

  return (
    <>
      <TooltipHeader>
        <img
          src={profile.image}
          alt={profile.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {profile.type === "person" ? (
              <User className="w-3 h-3 text-blue-400" />
            ) : (
              <Building2 className="w-3 h-3 text-purple-400" />
            )}
            <h3 className="font-semibold text-white text-sm">
              {profile.name}
            </h3>
          </div>
          {profile.companyType && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
              {profile.companyType}
            </span>
          )}
        </div>
      </TooltipHeader>

      <p className="text-white/80 mb-2 text-xs line-clamp-2">
        {profile.description}
      </p>

      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-white/60 flex items-center space-x-1">
            <Target className="w-3 h-3" />
            <span>Current MRR</span>
          </span>
          <span className="text-green-400 font-medium">
            ${currentMrr.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 flex items-center space-x-1">
            <Target className="w-3 h-3" />
            <span>Target MRR</span>
          </span>
          <span className="text-blue-400 font-medium">
            ${profile.targetMrr.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/60 flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created</span>
          </span>
          <span className="text-white/80">
            {formatDate(profile.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/60">Progress</span>
          <span className="text-white/80">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
            style={{ 
              width: `${Math.min(progressPercentage, 100)}%`,
              height: '100%'
            }}
          />
        </div>
      </div>
    </>
  );
}

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export default ProfileTooltipContent;