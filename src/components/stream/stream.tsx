import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Mrr from "../mrr";
import { Profile } from "../../types/profile";
import { SourceItem, DestinationItem } from "../../types/source";
import { profiles } from "../../data/profiles";
import Circle from "./circle";
import Cluster from "./cluster";

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  noiseOffset: number;
  rotationSpeed: number;
  speedCategory: "slow" | "medium" | "fast";
  sign: string;
  signSize: number;
  isCent: boolean;
  idx: number;
  type: "source" | "destination";
}

const PARTICLES_PER_SOURCE = 1000;
const cubicBezier = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) => {
  return (
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * t * t * p2 +
    Math.pow(t, 3) * p3
  );
};

interface StreamComponentProps {
  mrr?: number;
  className?: string;
  profile: Profile;
  size?: number;
  width?: number;
  height?: number;
  profilePositionPercentage?: number;
  density?: number;
  hideName?: boolean;
}

function StreamComponent({
  mrr,
  profile,
  size = 160,
  width = window.innerWidth,
  height = window.innerHeight,
  profilePositionPercentage = 0.5,
  density = 1,
  hideName = false,
}: StreamComponentProps) {
  const dotsPerStream = density * PARTICLES_PER_SOURCE;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const animationIdRef = useRef<number | null>(null);
  const sourceParticlesRef = useRef<Particle[]>([]);
  const destinationParticlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({
    width,
    height,
  });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const sourcesRef = useRef<SourceItem[]>([]);
  const destinationsRef = useRef<DestinationItem[]>([]);
  const userPointRef = useRef({
    x: dimensions.width * 0.5,
    y: dimensions.height * profilePositionPercentage,
  });

  // State for React circle positions
  const [circlePositions, setCirclePositions] = useState({
    sources: [] as SourceItem[],
    destinations: [] as DestinationItem[],
    user: { x: 0, y: 0 },
  });

  // Clustering logic
  const createSourceItems = (width: number, height: number): SourceItem[] => {
    // Get all profiles except the current one for sources
    const sourceProfiles = profiles.filter((p) => p.id !== profile.id);

    // Calculate evenly spaced Y positions based on source count
    const getEvenlySpacedPositions = (count: number) => {
      if (count === 1) return [height * 0.35]; // Sources at 35%
      if (count === 2) return [height * 0.35, height * 0.65];
      if (count === 3) return [height * 0.15, height * 0.5, height * 0.85];
      if (count === 4)
        return [height * 0.15, height * 0.38, height * 0.62, height * 0.85];
      // For more than 4, fall back to even distribution
      const positions = [
        height * 0.1,
        height * 0.33,
        height * 0.67,
        height * 0.9,
      ];
      return positions.slice(0, count);
    };

    if (sourceProfiles.length <= 4) {
      // No clustering needed - show all as individual circles
      const yPositions = getEvenlySpacedPositions(sourceProfiles.length);
      return sourceProfiles.map((prof, index) => ({
        type: "single" as const,
        x: width * 0.1,
        y: yPositions[index],
        profiles: [prof],
      }));
    } else {
      // Clustering logic: first 3 as individual, rest as cluster
      const items: SourceItem[] = [];
      const yPositions = getEvenlySpacedPositions(4); // 3 individual + 1 cluster

      // First 3 as individual circles
      for (let i = 0; i < 3; i++) {
        items.push({
          type: "single",
          x: width * 0.1,
          y: yPositions[i],
          profiles: [sourceProfiles[i]],
        });
      }

      // Remaining profiles as cluster
      const clusterProfiles = sourceProfiles.slice(3);
      items.push({
        type: "cluster",
        x: width * 0.1,
        y: yPositions[3],
        profiles: clusterProfiles,
      });

      return items;
    }
  };

  // Clustering logic for destinations
  const createDestinationItems = (
    width: number,
    height: number
  ): DestinationItem[] => {
    // Get all profiles except the current one for destinations
    const availableProfiles = profiles.filter((p) => p.id !== profile.id);
    // Use different profiles than sources (take from the end)
    const destinationProfiles = availableProfiles.slice(-4); // Take last 4 profiles

    // Calculate evenly spaced Y positions based on destination count
    const getEvenlySpacedPositions = (count: number) => {
      if (count === 1) return [height * 0.65]; // Destinations at 65%
      if (count === 2) return [height * 0.35, height * 0.65];
      if (count === 3) return [height * 0.15, height * 0.5, height * 0.85];
      if (count === 4)
        return [height * 0.1, height * 0.33, height * 0.67, height * 0.9];
      // For more than 4, fall back to even distribution
      const positions = [
        height * 0.1,
        height * 0.33,
        height * 0.67,
        height * 0.9,
      ];
      return positions.slice(0, count);
    };

    if (destinationProfiles.length <= 2) {
      // No clustering needed - show all as individual circles
      const yPositions = getEvenlySpacedPositions(destinationProfiles.length);
      return destinationProfiles.map((prof, index) => ({
        type: "single" as const,
        x: width * 0.9,
        y: yPositions[index],
        profiles: [prof],
      }));
    } else {
      // Clustering logic: first 2 as individual, rest as cluster
      const items: DestinationItem[] = [];
      const yPositions = getEvenlySpacedPositions(3); // 2 individual + 1 cluster

      // First 2 as individual circles
      for (let i = 0; i < 2; i++) {
        if (destinationProfiles[i]) {
          items.push({
            type: "single",
            x: width * 0.9,
            y: yPositions[i],
            profiles: [destinationProfiles[i]],
          });
        }
      }

      // Remaining profiles as cluster (if any)
      const clusterProfiles = destinationProfiles.slice(2);
      if (clusterProfiles.length > 0) {
        items.push({
          type: "cluster",
          x: width * 0.9,
          y: yPositions[2],
          profiles: clusterProfiles,
        });
      }

      return items;
    }
  };

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions((dimensions) => {
        const newDimensions: Partial<typeof dimensions> = {};
        if (width == null) {
          newDimensions.width = window.innerWidth;
        }
        if (height == null) {
          newDimensions.height = window.innerHeight;
        }
        return {
          width: newDimensions.width ?? dimensions.width,
          height: newDimensions.height ?? dimensions.height,
        };
      });

      const newSources = createSourceItems(width, height);
      const newDestinations = createDestinationItems(width, height);
      const newUser = {
        x: width * 0.5,
        y: height * profilePositionPercentage,
      };

      sourcesRef.current = newSources;
      destinationsRef.current = newDestinations;
      userPointRef.current = newUser;

      // Update React state for circle positions
      setCirclePositions({
        sources: newSources,
        destinations: newDestinations,
        user: newUser,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [profile.id, width, height]);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const { left, top } = canvas.getBoundingClientRect();

    // Track mouse position directly in ref (no React state)
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: event.clientX - left,
        y: event.clientY - top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Simple noise function for organic movement
    const noise = (x: number, y: number, time: number) => {
      return (
        Math.sin(x * 0.01 + time * 0.001) *
        Math.cos(y * 0.01 + time * 0.0015) *
        Math.sin((x + y) * 0.005 + time * 0.0005)
      );
    };

    // Mouse avoidance function with reduced parameters
    const calculateMouseAvoidance = (particleX: number, particleY: number) => {
      const mouseX = mousePositionRef.current.x;
      const mouseY = mousePositionRef.current.y;
      const avoidanceRadius = 150;
      const avoidanceStrength = 30;

      const dx = particleX - mouseX;
      const dy = particleY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < avoidanceRadius && distance > 0) {
        // Calculate avoidance force (stronger when closer)
        const force = (avoidanceRadius - distance) / avoidanceRadius;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;

        return {
          x: normalizedDx * force * avoidanceStrength,
          y: normalizedDy * force * avoidanceStrength,
        };
      }

      return { x: 0, y: 0 };
    };

    const getParticleSize = () => {
      const sizeRandomValue = Math.random();
      return (
        1.4 +
        sizeRandomValue * (sizeRandomValue > 0.9 ? Math.random() * 5 : 2.5)
      );
    };

    const getParticleColor = (type: "source" | "destination") => {
      if (type === "source") {
        return 180 + Math.random() * 60;
      }
      return 80 + Math.random() * 60;
    };

    const getParticleSign = () => {
      return ["$", "$", "$", "£", "€", "€", "€", "¥", "₹"][
        Math.floor(Math.random() * 9)
      ];
    };

    const getParticleSignSize = (size: number) => {
      return 10 + Math.random() * 20 + size;
    };

    // Generate speed based on category with more variation
    const generateSpeed = (category: "slow" | "medium" | "fast") => {
      switch (category) {
        case "slow":
          return 0.0003 + Math.random() * 0.0003; // Very slow particles
        case "medium":
          return 0.0005 + Math.random() * 0.0005; // Medium speed particles
        case "fast":
          return 0.001 + Math.random() * 0.0008; // Fast particles
        default:
          return 0.0005;
      }
    };

    // Initialize particles
    const initializeParticles = () => {
      sourceParticlesRef.current = [];
      destinationParticlesRef.current = [];
      const sourcesCount = sourcesRef.current.length;
      const destinationsCount = destinationsRef.current.length;
      for (
        let i = 0;
        i < dotsPerStream * (sourcesCount + destinationsCount);
        i++
      ) {
        // Distribute speed categories: 40% slow, 40% medium, 20% fast
        let speedCategory: "slow" | "medium" | "fast";
        const rand = Math.random();
        if (rand < 0.4) {
          speedCategory = "slow";
        } else if (rand < 0.8) {
          speedCategory = "medium";
        } else {
          speedCategory = "fast";
        }

        const speed = generateSpeed(speedCategory);
        const size = getParticleSize();
        const index = Math.floor(i / dotsPerStream);
        const idx = index < sourcesCount ? index : index - sourcesCount;
        const type = index < sourcesCount ? "source" : "destination";
        const start =
          type === "source" ? sourcesRef.current[idx] : userPointRef.current;
        sourceParticlesRef.current.push({
          x: start.x,
          y: start.y,
          progress: Math.random(),
          speed,
          size,
          opacity: 0.25 + Math.random() * 0.6,
          hue: getParticleColor(type),
          noiseOffset: Math.random() * 1000,
          rotationSpeed: 0.3 + Math.random() * 0.7,
          speedCategory: speedCategory,
          sign: getParticleSign(),
          signSize: getParticleSignSize(size),
          isCent: Math.random() < 0.5,
          idx,
          type,
        });
      }
    };

    initializeParticles();

    const getPointOnCurve = (
      t: number,
      idx: number,
      type: "source" | "destination"
    ) => {
      const start =
        type === "source" ? sourcesRef.current[idx] : userPointRef.current;
      const end =
        type === "source" ? userPointRef.current : destinationsRef.current[idx];
      const cp1 = {
        x: start.x + (end.x - start.x) * 0.8,
        y: start.y + (end.y - start.y) * 0.1,
      };
      const cp2 = {
        x: start.x + (end.x - start.x) * 0.21,
        y: start.y + (end.y - start.y) * 0.78,
      };
      const x = cubicBezier(t, start.x, cp1.x, cp2.x, end.x);
      const y = cubicBezier(t, start.y, cp1.y, cp2.y, end.y);
      return { x, y };
    };

    // Animation loop
    const animate = () => {
      timeRef.current = (timeRef.current + 1) % 1e8;

      // Clear the canvas to make it transparent
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw particles
      sourceParticlesRef.current.forEach((particle) => {
        // Update particle position along the curve
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          // Reset particle at the beginning with new speed
          const size = getParticleSize();
          particle.progress = 0;
          particle.speed = generateSpeed(particle.speedCategory);
          particle.size = size;
          particle.opacity = 0.25 + Math.random() * 0.6;
          particle.hue = getParticleColor(particle.type);
          particle.noiseOffset = Math.random() * 1000;
          particle.rotationSpeed = 0.3 + Math.random() * 0.7;
          particle.sign = getParticleSign();
          particle.signSize = getParticleSignSize(size);
          particle.isCent = Math.random() < 0.35;
        }

        const basePosition = getPointOnCurve(
          particle.progress,
          particle.idx,
          particle.type
        );

        // Calculate fluid movement with speed-based variation
        const time = timeRef.current + particle.noiseOffset;

        // Adjust distortion based on speed category
        let distortionRadius = 70;
        if (particle.speedCategory === "fast") {
          distortionRadius = 50; // Less distortion for fast particles
        } else if (particle.speedCategory === "slow") {
          distortionRadius = 90; // More distortion for slow particles
        }

        // Multi-layered noise for complex movement
        const noiseX1 =
          noise(basePosition.x, basePosition.y, time) * distortionRadius;
        const noiseY1 =
          noise(basePosition.y, basePosition.x, time * 1.3) * distortionRadius;

        // Secondary noise layer
        const noiseX2 =
          noise(basePosition.x * 0.5, basePosition.y * 0.5, time * 0.7) *
          (distortionRadius * 0.5);
        const noiseY2 =
          noise(basePosition.y * 0.5, basePosition.x * 0.5, time * 0.9) *
          (distortionRadius * 0.5);

        // Circular motion component varies by speed
        const circularRadius =
          particle.speedCategory === "fast"
            ? 15
            : particle.speedCategory === "slow"
            ? 25
            : 20;
        const circularSpeed =
          particle.speedCategory === "fast"
            ? 1.5
            : particle.speedCategory === "slow"
            ? 0.7
            : 1.0;

        const circularX =
          Math.cos(
            time * 0.001 * particle.rotationSpeed * circularSpeed +
              particle.noiseOffset
          ) * circularRadius;
        const circularY =
          Math.sin(
            time * 0.001 * particle.rotationSpeed * circularSpeed +
              particle.noiseOffset
          ) * circularRadius;

        // Combine all movement components
        const movementCoeficient = Math.sin(particle.progress * Math.PI) ** 0.2;
        let finalX =
          basePosition.x + (noiseX1 + noiseX2 + circularX) * movementCoeficient;
        let finalY =
          basePosition.y + (noiseY1 + noiseY2 + circularY) * movementCoeficient;

        // Apply mouse avoidance
        const avoidance = calculateMouseAvoidance(finalX, finalY);
        finalX += avoidance.x;
        finalY += avoidance.y;

        particle.x = finalX;
        particle.y = finalY;

        // Calculate color that changes from blue to pink
        const hue = particle.hue - particle.progress * 100;

        // Adjust opacity based on speed category for visual differentiation
        let adjustedOpacity = particle.opacity;
        if (particle.speedCategory === "fast") {
          adjustedOpacity *= 1.1; // Slightly more visible
        } else if (particle.speedCategory === "slow") {
          adjustedOpacity *= 0.8; // Slightly less visible
        }

        if (particle.size > 3.4) {
          // Draw currency sign particle
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${adjustedOpacity * 1.1})`;
          ctx.font = `bold ${particle.signSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(particle.sign, particle.x, particle.y);
          if (particle.sign === "€") {
            ctx.lineWidth = 1;
            ctx.strokeStyle = `hsla(${hue}, 40%, 40%, ${adjustedOpacity})`;
            ctx.strokeText(particle.sign, particle.x, particle.y);
          }
        } else if (particle.isCent) {
          // Draw cent
          ctx.beginPath();
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${adjustedOpacity * 1.1})`;
          ctx.font = `bold ${particle.size * 5}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("¢", particle.x, particle.y);
        } else {
          // Draw crisp, clear particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${adjustedOpacity})`;
          ctx.fill();
        }
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions]);

  // Handle profile click with navigation
  const handleProfileClick = (clickedProfile: Profile) => {
    navigate(`/profile/${clickedProfile.id}`, {
      state: {
        viewTransition: true,
      },
    });
  };

  // Handle dragging for circles and clusters
  const handleSourceDrag = (index: number) => (newY: number) => {
    sourcesRef.current[index].y = newY;
    setCirclePositions((prev) => ({
      ...prev,
      sources: [...sourcesRef.current],
    }));
  };

  // Handle dragging for individual source circles
  const handleSingleSourceDrag = (index: number) => (newY: number) => {
    sourcesRef.current[index].y = newY;
    setCirclePositions((prev) => ({
      ...prev,
      sources: [...sourcesRef.current],
    }));
  };

  const handleDestinationDrag = (index: number) => (newY: number) => {
    destinationsRef.current[index].y = newY;
    setCirclePositions((prev) => ({
      ...prev,
      destinations: [...destinationsRef.current],
    }));
  };

  // Handle dragging for individual destination circles
  const handleSingleDestinationDrag = (index: number) => (newY: number) => {
    destinationsRef.current[index].y = newY;
    setCirclePositions((prev) => ({
      ...prev,
      destinations: [...destinationsRef.current],
    }));
  };

  const handleProfileDrag = (newY: number) => {
    userPointRef.current.y = newY;
    setCirclePositions((prev) => ({
      ...prev,
      user: { ...userPointRef.current },
    }));
  };

  return (
    <StreamContainer>
      <Canvas ref={canvasRef} />

      {/* Source Circles and Clusters */}
      {circlePositions.sources.map((source, index) =>
        source.type === "single" ? (
          <Circle
            key={`source-${index}`}
            type="source"
            posX={source.x}
            posY={source.y}
            profile={source.profiles[0]}
            size={size}
            onDrag={handleSingleSourceDrag(index)}
            onClick={() => handleProfileClick(source.profiles[0])}
            viewTransitionName={`profile-${source.profiles[0].id}`}
          />
        ) : (
          <Cluster
            key={`cluster-${index}`}
            type="source"
            posX={source.x}
            posY={source.y}
            size={size}
            profiles={source.profiles}
            onDrag={handleSourceDrag(index)}
            onClick={(profile) => handleProfileClick(profile)}
          />
        )
      )}

      {/* User Circle with Image */}
      {userPointRef.current.x && userPointRef.current.y && profile ? (
        <Circle
          type="profile"
          posX={circlePositions.user.x}
          posY={circlePositions.user.y}
          profile={profile}
          size={size}
          onDrag={handleProfileDrag}
          viewTransitionName={`profile-${profile.id}`}
          hideName={hideName}
        />
      ) : null}

      {/* Destination Circles and Clusters */}
      {circlePositions.destinations.map((destination, index) =>
        destination.type === "single" ? (
          <Circle
            key={`destination-${index}`}
            type="destination"
            posX={destination.x}
            posY={destination.y}
            profile={destination.profiles[0]}
            size={size}
            onDrag={handleSingleDestinationDrag(index)}
            onClick={() => handleProfileClick(destination.profiles[0])}
            viewTransitionName={`profile-${destination.profiles[0].id}`}
          />
        ) : (
          <Cluster
            key={`destination-cluster-${index}`}
            type="destination"
            posX={destination.x}
            posY={destination.y}
            profiles={destination.profiles}
            size={size}
            onDrag={handleDestinationDrag(index)}
            onClick={(profile) => handleProfileClick(profile)}
          />
        )
      )}

      {mrr != null && (
        <Mrr value={mrr} position="absolute" bottom="0" left="50%" />
      )}
    </StreamContainer>
  );
}

const StreamContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export default StreamComponent;
