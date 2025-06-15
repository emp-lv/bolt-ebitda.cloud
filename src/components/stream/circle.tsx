import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Profile } from "../../types/profile";
import Tooltip from "../tooltip";
import ProfileTooltipContent from "../profileTooltipContent";

interface CircleProps {
  type: "source" | "profile" | "destination";
  posX: number;
  posY: number;
  profile: Profile;
  onDrag?: (newY: number) => void;
}

const BACKGROUND_COLORS = {
  source: "rgb(64, 224, 255)",
  profile: "rgb(191, 255, 180)",
  destination: "rgb(255, 198, 99)",
};

function Circle({ type, posX, posY, profile, onDrag }: CircleProps) {
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a link
    if ((e.target as HTMLElement).closest("a")) {
      return;
    }

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

  if (type === "profile") {
    return (
      <>
        <ProfileName $left={posX} $top={posY - 100}>
          {profile.name}
        </ProfileName>
        <CircleContainer
          $left={posX}
          $top={posY}
          $isDragging={isDraggingRef.current}
          $backgroundColor={BACKGROUND_COLORS.profile}
          onMouseDown={handleMouseDown}
        >
          <Tooltip
            trigger={
              <Link to={`/profile/${profile.id}`}>
                <CircleImage src={profile.image} alt={profile.name} />
              </Link>
            }
            content={<ProfileTooltipContent profile={profile} />}
            position="right"
          />
        </CircleContainer>
      </>
    );
  }

  // For source and destination circles, show profile image with tooltip
  return (
    <CircleContainer
      $left={posX}
      $top={posY}
      $isDragging={isDraggingRef.current}
      $backgroundColor={BACKGROUND_COLORS[type]}
      onMouseDown={handleMouseDown}
    >
      <Tooltip
        trigger={
          <Link to={`/profile/${profile.id}`}>
            <CircleImage src={profile.image} alt={profile.name} />
          </Link>
        }
        content={<ProfileTooltipContent profile={profile} />}
        position={type === "destination" ? "left" : "right"}
      />
    </CircleContainer>
  );
}

const ProfileName = styled.div<{
  $left: number;
  $top: number;
}>`
  position: absolute;
  transform: translateX(-50%);
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
  text-align: center;
  white-space: nowrap;
  ${({ $left, $top }) => `
    left: ${$left}px;
    top: ${$top}px;
  `}
`;

const CircleContainer = styled.div<{
  $left: number;
  $top: number;
  $backgroundColor: string;
  $isDragging?: boolean;
}>`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  cursor: ${(props) => (props.$isDragging ? "grabbing" : "grab")};
  padding: 4px;

  ${({ $left, $top, $backgroundColor }) => `
    left: ${$left}px;
    top: ${$top}px;
    background-color: ${$backgroundColor};
  `}
`;

const CircleImage = styled.img`
  width: 152px;
  height: 152px;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.2s ease;
  pointer-events: none;

  &:hover {
    transform: scale(1.04);
  }
`;

export default Circle;
