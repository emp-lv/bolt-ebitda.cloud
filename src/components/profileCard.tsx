import React from "react";
import { Link } from "react-router-dom";
import { User, Building2, Calendar, Target } from "lucide-react";
import { Profile } from "../types/profile";
import LiquidGlass from "./liquidGlass";

interface ProfileCardProps {
  profile: Profile;
}

function ProfileCard({ profile }: ProfileCardProps) {
  const currentMrr = profile.currentMrr || 0; // Default to 0 if undefined
  const targetMrr = profile.targetMrr || 1; // Default to 1 to avoid division by zero
  const progressPercentage = (currentMrr / targetMrr) * 100;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCompanyTypeColor = (companyType?: string) => {
    switch (companyType) {
      case "SaaS":
        return "bg-blue-500/20 text-blue-300";
      case "Agency":
        return "bg-purple-500/20 text-purple-300";
      case "Retail":
        return "bg-green-500/20 text-green-300";
      case "Royalties":
        return "bg-yellow-500/20 text-yellow-300";
      case "Newsletter":
        return "bg-orange-500/20 text-orange-300";
      default:
        return "bg-green-500/20 text-green-300";
    }
  };

  return (
    <Link to={`/profile/${profile.id}`} className="block group h-full">
      <div className="h-full">
        <LiquidGlass>
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {profile.type === "person" ? (
                    <User className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Building2 className="w-4 h-4 text-purple-400" />
                  )}
                  <h3 className="text-lg font-semibold text-white truncate">
                    {profile.name}
                  </h3>
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCompanyTypeColor(
                    profile.companyType
                  )}`}
                >
                  {profile.companyType || "Private"}
                </span>
              </div>
            </div>

            {/* Description - This section will grow to fill available space */}
            <div className="flex-1 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* MRR Progress - Fixed section */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>MRR Progress</span>
                </span>
                <span className="text-green-400 font-medium">
                  ${currentMrr.toLocaleString()} / $
                  {targetMrr.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-white/60">
                {progressPercentage.toFixed(1)}% of target
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center space-x-1 text-xs text-white/60">
                <Calendar className="w-3 h-3" />
                <span>Created {formatDate(profile.createdAt)}</span>
              </div>
              <div className="text-xs text-green-400 group-hover:text-green-300 transition-colors">
                View Stream →
              </div>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </Link>
  );
}

export default ProfileCard;
