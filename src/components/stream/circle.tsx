import React, { useRef } from "react";
import styled from "styled-components";
import { Profile } from "../../types/profile";
import Tooltip from "../tooltip";
import ProfileTooltipContent from "../profileTooltipContent";
import { Link } from "react-router-dom";

interface CircleProps {
  type: "source" | "profile" | "destination";
  posX: number;
  posY: number;
  profile: Profile;
  onDrag?: (newY: number) => void;
  onClick?: () => void;
  onEditClick?: () => void;
  size?: number;
  viewTransitionName?: string;
  hideName?: boolean;
}

const BACKGROUND_COLORS = {
  source: "rgb(64, 224, 255)",
  profile: "rgb(191, 255, 180)",
  destination: "rgb(255, 198, 99)",
};

function Circle({
  type,
  posX,
  posY,
  profile,
  size = 160,
  onDrag,
  onClick,
  onEditClick,
  viewTransitionName,
  hideName = false,
}: CircleProps) {
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Handle dragging
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDraggingRef.current) return;
    if (Math.abs(dragStartYRef.current - e.clientY) > 3) return;

    if (type === "profile" && onEditClick) {
      onEditClick();
    } else if (onClick) {
      onClick();
    }
  };

  if (type === "profile") {
    return (
      <CenterProfileContainer $left={posX} $top={posY} $size={size}>
        {hideName ? null : <ProfileName>{profile.name}</ProfileName>}
        <CircleContainer
          to={`/profile/${profile.id}`}
          viewTransition
          $size={size}
          $isDragging={isDraggingRef.current}
          $backgroundColor={BACKGROUND_COLORS.profile}
          onMouseDown={handleMouseDown}
          $viewTransitionName={viewTransitionName}
        >
          <Tooltip
            trigger={
              <CircleImage
                $size={size}
                src={profile.image}
                alt={profile.name}
              />
            }
            content={<ProfileTooltipContent profile={profile} />}
            position="right"
          />
        </CircleContainer>
      </CenterProfileContainer>
    );
  }

  // For source and destination circles, show profile image with tooltip
  return (
    <CircleContainer
      to={`/profile/${profile.id}`}
      viewTransition
      $left={posX}
      $top={posY}
      $size={size}
      $isDragging={isDraggingRef.current}
      $backgroundColor={BACKGROUND_COLORS[type]}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{ viewTransitionName: `profile-${profile.id}` }}
    >
      <Tooltip
        trigger={
          <CircleImage $size={size} src={profile.image} alt={profile.name} />
        }
        content={<ProfileTooltipContent profile={profile} />}
        position={type === "destination" ? "left" : "right"}
      />
    </CircleContainer>
  );
}

const CenterProfileContainer = styled.div<{
  $left: number;
  $top: number;
  $size: number;
}>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  transform: translate(-50%, -50%);
  ${({ $left, $top }) => `
    left: ${$left}px;
    top: ${$top}px;
  `}
`;

const ProfileName = styled.div`
  width: 100%;
  position: absolute;
  transform: translate(-50%, -64px);
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
  text-align: center;
  white-space: nowrap;
`;

// const CircleContainer = styled.div<{
const CircleContainer = styled(Link)<{
  $left?: number;
  $top?: number;
  $backgroundColor: string;
  $isDragging?: boolean;
  $size: number;
  $viewTransitionName?: string;
}>`
  position: absolute;
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  z-index: 5;
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "pointer")};
  padding: 4px;

  ${({ $left, $top, $backgroundColor }) => `
    ${$left ? `left: ${$left}px;` : ""}
    ${$top ? `top: ${$top}px;` : ""}
    ${$left && $top ? `transform: translate(-50%, -50%);` : ""}
    background-color: ${$backgroundColor};
  `}
`;

const CircleImage = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size - 8}px;
  height: ${({ $size }) => $size - 8}px;
  object-fit: cover;
  border-radius: 50%;
  pointer-events: none;
`;

export default Circle;
