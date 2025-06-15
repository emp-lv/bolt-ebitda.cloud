import React from "react";
import styled from "styled-components";
import { Profile } from "../../types/profile";

interface CircleProps {
  type: "source" | "profile" | "destination";
  posX: number;
  posY: number;
  profile: Profile;
}

const BACKGROUND_COLORS = {
  source: "rgb(64, 224, 255)",
  profile: "rgb(191, 255, 180)",
  destination: "rgb(255, 198, 99)",
};

function Circle({ type, posX, posY, profile }: CircleProps) {
  return (
    <CircleContainer
      $left={posX}
      $top={posY}
      $backgroundColor={BACKGROUND_COLORS[type]}
    />

    // {/* User Circle with Image */}
    // <UserCircle
    //   style={{
    //     left: circlePositions.user.x,
    //     top: circlePositions.user.y,
    //   }}
    //   onMouseEnter={() => setShowTooltip(true)}
    //   onMouseLeave={() => setShowTooltip(false)}
    // >
    //   <UserImage src={profile.image} alt={profile.name} />

    //   {/* Tooltip */}
    //   {showTooltip && (
    //     <Tooltip>
    //       <TooltipContent>
    //         <TooltipHeader>
    //           <img
    //             src={profile.image}
    //             alt={profile.name}
    //             className="w-12 h-12 rounded-full object-cover"
    //           />
    //           <div>
    //             <div className="flex items-center space-x-2 mb-1">
    //               {profile.type === "person" ? (
    //                 <User className="w-4 h-4 text-blue-400" />
    //               ) : (
    //                 <Building2 className="w-4 h-4 text-purple-400" />
    //               )}
    //               <h3 className="font-semibold text-white">{profile.name}</h3>
    //             </div>
    //             {profile.companyType && (
    //               <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
    //                 {profile.companyType}
    //               </span>
    //             )}
    //           </div>
    //         </TooltipHeader>

    //         <p className="text-white/80 text-sm mb-3">
    //           {profile.description}
    //         </p>

    //         <div className="space-y-2 text-sm">
    //           <div className="flex items-center justify-between">
    //             <span className="text-white/60 flex items-center space-x-1">
    //               <Target className="w-3 h-3" />
    //               <span>Current MRR</span>
    //             </span>
    //             <span className="text-green-400 font-medium">
    //               ${currentMrr.toLocaleString()}
    //             </span>
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <span className="text-white/60 flex items-center space-x-1">
    //               <Target className="w-3 h-3" />
    //               <span>Target MRR</span>
    //             </span>
    //             <span className="text-blue-400 font-medium">
    //               ${profile.targetMrr.toLocaleString()}
    //             </span>
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <span className="text-white/60 flex items-center space-x-1">
    //               <Calendar className="w-3 h-3" />
    //               <span>Created</span>
    //             </span>
    //             <span className="text-white/80">
    //               {formatDate(profile.createdAt)}
    //             </span>
    //           </div>
    //         </div>

    //         <div className="mt-3">
    //           <div className="flex items-center justify-between text-xs mb-1">
    //             <span className="text-white/60">Progress</span>
    //             <span className="text-white/80">
    //               {progressPercentage.toFixed(1)}%
    //             </span>
    //           </div>
    //           <div className="w-full bg-white/10 rounded-full h-2">
    //             <div
    //               className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
    //               style={{ width: `${Math.min(progressPercentage, 100)}%` }}
    //             />
    //           </div>
    //         </div>
    //       </TooltipContent>
    //     </Tooltip>
    //   )}
    // </UserCircle>
  );
}

const ProfileName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -180px);
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
  text-align: center;
  white-space: nowrap;
`;

const CircleContainer = styled.div<{
  $left: number;
  $top: number;
  $backgroundColor: string;
}>`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(0, 0, 0, 0.3);
  z-index: 5;
  pointer-events: none;
  ${({ $left, $top, $backgroundColor }) => `
    left: ${$left}px;
    top: ${$top}px;
    background-color: ${$backgroundColor};
  `}
`;

const UserCircle = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
  cursor: pointer;
  overflow: hidden;
`;

const UserImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  pointer-events: none; /* Prevents image from interfering with dragging */
`;

const Tooltip = styled.div`
  position: absolute;
  top: 50%;
  left: 120px;
  transform: translateY(-50%);
  z-index: 20;
  pointer-events: none;
`;

const TooltipContent = styled.div`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export default Circle;
