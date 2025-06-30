import React, { useRef } from "react";
import styled from "styled-components";
import { Profile } from "../../types/profile";
import Tooltip from "../tooltip";
import ProfileTooltipContent from "../profileTooltipContent";

interface ClusterProps {
  type: "source" | "destination";
  posX: number;
  posY: number;
  profiles: Profile[];
  size?: number;
  onDrag?: (newY: number) => void;
  onClick?: (profile: Profile) => void;
}

const CLUSTER_COLORS = {
  source: "rgba(64, 224, 255, 0.9)",
  destination: "rgba(255, 198, 99, 0.9)",
};

function Cluster({
  type,
  posX,
  posY,
  profiles,
  size = 160,
  onDrag,
  onClick,
}: ClusterProps) {
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Calculate grid layout for profiles
  const getGridLayout = (count: number) => {
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 16) return { cols: 4, rows: 4 };
    return { cols: 4, rows: 4 }; // Max 16 profiles visible
  };

  const { cols, rows } = getGridLayout(profiles.length);
  const visibleProfiles = profiles.slice(0, cols * rows);
  const hasMore = profiles.length > visibleProfiles.length;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const newY = Math.max(
        80,
        Math.min(window.innerHeight - 144, posY + deltaY)
      ); // Account for navbar + circle radius
      onDrag?.(newY);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleProfileClick = (profile: Profile, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDraggingRef.current) return;
    if (Math.abs(dragStartYRef.current - e.clientY) > 3) return;

    // Don't handle clicks for "other" placeholder sources
    if (profile.id.includes('other-')) {
      return;
    }

    if (onClick) {
      onClick(profile);
    }
  };

  const tooltipPosition = type === "destination" ? "left" : "right";

  return (
    <ClusterContainer
      $left={posX}
      $top={posY}
      $size={size}
      $isDragging={isDraggingRef.current}
      $backgroundColor={CLUSTER_COLORS[type]}
      onMouseDown={handleMouseDown}
    >
      <ClusterGrid $cols={cols} $rows={rows}>
        {visibleProfiles.map((profile) => {
          const isOtherSource = profile.id.includes('other-');
          
          if (isOtherSource) {
            // Render without tooltip for "other" sources
            return (
              <ProfileContainer
                key={profile.id}
                onClick={(e) => handleProfileClick(profile, e)}
                $viewTransitionName={`profile-${profile.id}`}
              >
                <ProfileImage
                  src={profile.image}
                  alt={profile.name}
                  title={profile.name}
                />
              </ProfileContainer>
            );
          }
          
          return (
            <Tooltip
              key={profile.id}
              trigger={
                <ProfileContainer
                  key={profile.id}
                  onClick={(e) => handleProfileClick(profile, e)}
                  $viewTransitionName={`profile-${profile.id}`}
                >
                  <ProfileImage
                    src={profile.image}
                    alt={profile.name}
                    title={profile.name}
                  />
                </ProfileContainer>
              }
              content={<ProfileTooltipContent profile={profile} />}
              position={tooltipPosition}
            />
          );
        })}
        {hasMore && (
          <MoreIndicator>
            +{profiles.length - visibleProfiles.length}
          </MoreIndicator>
        )}
      </ClusterGrid>
    </ClusterContainer>
  );
}

const ClusterContainer = styled.div<{
  $left: number;
  $top: number;
  $size: number;
  $isDragging: boolean;
  $backgroundColor: string;
}>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 12px;
  transform: translate(-50%, -50%);
  background: ${(props) => props.$backgroundColor};
  z-index: 5;
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "pointer")};
  padding: 4px;

  ${({ $left, $top }) => `
    left: ${$left}px;
    top: ${$top}px;
  `}
`;

const ClusterGrid = styled.div<{
  $cols: number;
  $rows: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols}, 1fr);
  grid-template-rows: repeat(${(props) => props.$rows}, 1fr);
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const ProfileContainer = styled.div<{ $viewTransitionName: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  ${({ $viewTransitionName }) => `
    view-transition-name: ${$viewTransitionName};
  `}
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  pointer-events: auto;
`;

const MoreIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

export default Cluster;
