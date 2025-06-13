import React, { useRef, useEffect, useState } from "react";

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

const PARTICLES_PER_SOURCE = 1200;
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

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const sourceParticlesRef = useRef<Particle[]>([]);
  const destinationParticlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const sourcesRef = useRef<{ x: number; y: number }[]>([]);
  const destinationsRef = useRef<{ x: number; y: number }[]>([]);
  const isDraggingRef = useRef<{
    type: "source" | "destination" | "center" | null;
    index: number;
  }>({ type: null, index: -1 });
  const userPointRef = useRef({ x: 0, y: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({
        width,
        height,
      });
      sourcesRef.current = [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.1, y: height * 0.5 },
        { x: width * 0.1, y: height * 0.9 },
      ];
      destinationsRef.current = [
        { x: width * 0.9, y: height * 0.3 },
        { x: width * 0.9, y: height * 0.7 },
      ];
      userPointRef.current = {
        x: width * 0.5,
        y: height * 0.5,
      };
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Track mouse position directly in ref (no React state)
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Handle dragging functionality
    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const clickRadius = 80; // Same as circle radius

      // Check if clicking on a source
      for (let i = 0; i < sourcesRef.current.length; i++) {
        const source = sourcesRef.current[i];
        const distance = Math.sqrt(
          Math.pow(mouseX - source.x, 2) + Math.pow(mouseY - source.y, 2)
        );
        if (distance <= clickRadius) {
          isDraggingRef.current = { type: "source", index: i };
          return;
        }
      }

      // Check if clicking on a destination
      for (let i = 0; i < destinationsRef.current.length; i++) {
        const destination = destinationsRef.current[i];
        const distance = Math.sqrt(
          Math.pow(mouseX - destination.x, 2) + Math.pow(mouseY - destination.y, 2)
        );
        if (distance <= clickRadius) {
          isDraggingRef.current = { type: "destination", index: i };
          return;
        }
      }

      // Check if clicking on the center circle
      const distance = Math.sqrt(
        Math.pow(mouseX - userPoint.x, 2) + Math.pow(mouseY - userPoint.y, 2)
      );
      if (distance <= clickRadius) {
        isDraggingRef.current = { type: "center", index: 0 };
        return;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = { type: null, index: -1 };
    };

    const handleDrag = (event: MouseEvent) => {
      if (isDraggingRef.current.type === null) return;

      const rect = canvas.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      
      // Constrain Y position to canvas bounds with padding
      const constrainedY = Math.max(80, Math.min(dimensions.height - 80, mouseY));

      if (isDraggingRef.current.type === "source") {
        sourcesRef.current[isDraggingRef.current.index].y = constrainedY;
      } else if (isDraggingRef.current.type === "destination") {
        destinationsRef.current[isDraggingRef.current.index].y = constrainedY;
      } else if (isDraggingRef.current.type === "center") {
        userPointRef.current.y = constrainedY;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleDrag);
    // Get user point from ref
    const userPoint = userPointRef.current;

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
      const avoidanceRadius = 150; //
      const avoidanceStrength = 30; //

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
        0.5 +
        sizeRandomValue * (sizeRandomValue > 0.9 ? Math.random() * 5 : 1.5)
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
      return 5 + Math.random() * 8 + size;
    };

    // Generate speed based on category with more variation
    const generateSpeed = (category: "slow" | "medium" | "fast") => {
      switch (category) {
        case "slow":
          return 0.0002 + Math.random() * 0.0003; // Very slow particles
        case "medium":
          return 0.0005 + Math.random() * 0.0005; // Medium speed particles
        case "fast":
          return 0.001 + Math.random() * 0.0008; // Fast particles
        default:
          return 0.0005;
      }
    };

    // Initialize particles (increased to 3000)
    const initializeParticles = () => {
      sourceParticlesRef.current = [];
      destinationParticlesRef.current = [];
      const sourcesCount = sourcesRef.current.length;
      const destinationsCount = destinationsRef.current.length;
      for (
        let i = 0;
        i < PARTICLES_PER_SOURCE * (sourcesCount + destinationsCount);
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
        const index = Math.floor(i / PARTICLES_PER_SOURCE);
        const idx = index < sourcesCount ? index : index - sourcesCount;
        const type = index < sourcesCount ? "source" : "destination";
        const start = type === "source" ? sourcesRef.current[idx] : userPoint;
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
          isCent: Math.random() < 0.35,
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
      const start = type === "source" ? sourcesRef.current[idx] : userPoint;
      const end = type === "source" ? userPoint : destinationsRef.current[idx];
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

      // Clear the entire canvas each frame with light cream background
      ctx.fillStyle = "rgb(252, 255, 248)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

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
        // [180 + 0..60] => [180..240 - 0..100] => [80..240]
        // [80 + 0..60] => [80..140 - 0..100] => [-20..140]
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

      // Draw left circle (source) - larger and crisp
      sourcesRef.current.forEach((source) => {
        ctx.beginPath();
        ctx.arc(source.x, source.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(64, 224, 255)";
        ctx.fill();
        ctx.strokeStyle = "rgb(60, 210, 2455)";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Draw user point
      ctx.beginPath();
      ctx.arc(userPoint.x, userPoint.y, 80, 0, Math.PI * 2);
      ctx.fillStyle = "rgb(191, 255, 180)";
      ctx.fill();
      ctx.strokeStyle = "rgb(170, 255, 200)";
      ctx.lineWidth = 3;
      ctx.stroke();

      destinationsRef.current.forEach((destination) => {
        // Draw right circle (destination) - larger and crisp
        ctx.beginPath();
        ctx.arc(destination.x, destination.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(255, 198, 99)";
        ctx.fill();
        ctx.strokeStyle = "rgb(255, 198, 150)";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleDrag);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions]);

  return (
    <div
      className="w-full h-screen overflow-hidden"
      style={{ 
        backgroundColor: "rgb(252, 255, 248)",
        cursor: "default"
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export default App;
// .site, .online, .store or .xyz domain