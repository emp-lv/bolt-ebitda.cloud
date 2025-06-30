import React, { useRef, useEffect, useState } from "react";
import {
  MapPin,
  Globe,
  Linkedin,
  Heart,
  Terminal,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { styled } from "styled-components";
import { MRRText } from "../components/mrr";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  sign: string;
  signSize: number;
  isCent: boolean;
  rotationSpeed: number;
  rotation: number;
}

function TeamMemberCanvas({
  width,
  height,
  colorScheme,
  particleType = "currency",
}: {
  width: number;
  height: number;
  colorScheme: { primary: number; secondary: number; range: number };
  particleType?: "currency" | "code";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 45;

    const getParticleSign = () => {
      if (particleType === "code") {
        return [
          "<",
          ">",
          "{",
          "}",
          "(",
          ")",
          "[",
          "]",
          "=",
          "+",
          "-",
          "*",
          "/",
          "%",
        ][Math.floor(Math.random() * 13)];
      }
      return ["$", "$", "£", "€", "¥", "₹", "¢"][Math.floor(Math.random() * 7)];
    };

    const getParticleColor = () => {
      const variation = (Math.random() - 0.5) * colorScheme.range;
      return colorScheme.primary + variation;
    };

    const getParticleSize = () => {
      const baseSize = particleType === "code" ? 1.2 : 1.4;
      const sizeRandomValue = Math.random();
      return (
        baseSize +
        sizeRandomValue * (sizeRandomValue > 0.8 ? Math.random() * 2.5 : 1.3)
      );
    };

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = getParticleSize();
        const particle: Particle = {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.3,
          vy: (Math.random() - 0.5) * 1.9,
          size,
          opacity: 0.4 + Math.random() * 0.4,
          hue: getParticleColor(),
          sign: getParticleSign(),
          signSize: 8 + Math.random() * 10 + size * 2,
          isCent: Math.random() < (particleType === "code" ? 0.1 : 0.3),
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          rotation: Math.random() * Math.PI * 2,
        };
        particlesRef.current.push(particle);
      }
    };

    initializeParticles();

    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Reset particles that go out of bounds
        if (
          particle.x < -20 ||
          particle.x > width + 20 ||
          particle.y < -20 ||
          particle.y > height + 20
        ) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.vx = (Math.random() - 0.5) * 1.3;
          particle.vy = (Math.random() - 0.5) * 1.9;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        const color = `hsla(${particle.hue}, 75%, 65%, ${particle.opacity})`;

        if (particle.size > 2.2) {
          // Draw sign (currency or code)
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.signSize}px ${
            particleType === "code" ? "monospace" : "sans-serif"
          }`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(particle.sign, 0, 0);
        } else if (particle.isCent && particleType === "currency") {
          // Draw cent (only for currency type)
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.size * 3.5}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("¢", 0, 0);
        } else {
          // Draw circle
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [width, height, colorScheme, particleType]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function TeamMemberCard({
  member,
}: {
  member: {
    name: string;
    role: string;
    description: string;
    image: string;
    location?: string;
    website?: string;
    linkedin?: string;
    email?: string;
    skills: string[];
    achievements: string[];
    colorScheme: { primary: number; secondary: number; range: number };
    particleType?: "currency" | "code";
  };
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="relative bg-noise">
      <div className="bg-slate-600/5 backdrop-blur-sm rounded-2xl border border-slate-600/10 overflow-hidden hover:border-slate-600/20 transition-all duration-300 transform hover:scale-105">
        {/* Canvas Header */}
        <div
          ref={canvasRef}
          className="relative h-48 bg-gradient-to-br from-slate-600/5 to-slate-600/10 overflow-hidden"
        >
          {/* Canvas Background */}
          <TeamMemberCanvas
            width={dimensions.width}
            height={dimensions.height}
            colorScheme={member.colorScheme}
            particleType={member.particleType}
          />

          {/* Profile Image */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-600/20 shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-600 mb-2">
              {member.name}
            </h3>
            <p className="text-blue-400 font-semibold mb-3">{member.role}</p>

            {member.location && (
              <div className="flex items-center justify-center space-x-1 text-slate-600/60 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{member.location}</span>
              </div>
            )}
          </div>

          <p className="text-slate-600/80 text-sm leading-relaxed mb-6 text-center">
            {member.description}
          </p>

          {/* Skills */}
          <div className="mb-6">
            <h4 className="text-slate-600 font-semibold mb-3 text-sm">
              Core Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-600/10 rounded-full text-slate-600/80 text-xs border border-slate-600/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="text-slate-600 font-semibold mb-3 text-sm">
              Key Contributions
            </h4>
            <div className="space-y-2">
              {member.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-slate-600/70 text-xs leading-relaxed">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-3">
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 bg-slate-600/10 hover:bg-slate-600/20 text-slate-600 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 bg-slate-600/10 hover:bg-slate-600/20 text-slate-600 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const teamMembers = [
    {
      name: "Emīls Pļavenieks",
      role: "Founder & Lead Developer",
      description:
        "Staff-level fullstack engineer from Latvia with a passion for transparency and building tools that solve real problems. Creator of My Earnings and advocate for open business practices.",
      image: "https://avatars.githubusercontent.com/u/16500803?v=4",
      location: "Latvia",
      website: "https://emp.lv",
      linkedin: "https://www.linkedin.com/in/emplv/",
      email: "emils@emp.lv",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Go",
        "Event Sourcing",
        "Full-Stack Development",
        "UI/UX Design",
        "Product Strategy",
      ],
      achievements: [
        "Built My Earnings from concept to launch as a solo developer",
        "Designed and implemented the interactive particle visualization system",
        "Created a platform that promotes transparency in business",
        "Maintains 100% free access to all features for the community",
        "Staff-level engineering expertise in modern web technologies",
      ],
      colorScheme: { primary: 240, secondary: 260, range: 50 },
      particleType: "currency" as const,
    },
    {
      name: "bolt.new",
      role: "Development Platform",
      description:
        "The AI-powered development platform by StackBlitz that made rapid prototyping and development of My Earnings possible. Enabling instant full-stack web development in the browser.",
      image:
        "https://pbs.twimg.com/profile_images/1880702021122342912/fe9TlQqJ_400x400.jpg",
      location: "Cloud-based",
      website: "https://bolt.new",
      linkedin: "https://www.linkedin.com/company/stackblitz/",
      skills: [
        "AI Development",
        "WebContainers",
        "Browser-based IDE",
        "Instant Deployment",
        "Full-Stack Development",
        "Code Generation",
      ],
      achievements: [
        "Enabled rapid prototyping and iteration of My Earnings features",
        "Provided instant development environment without local setup",
        "Facilitated seamless deployment and testing workflows",
        "Powered by Claude Sonnet 4 for intelligent code assistance",
        "Revolutionary browser-based development experience",
      ],
      colorScheme: { primary: 120, secondary: 140, range: 60 },
      particleType: "code" as const,
    },
  ];

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />

      <div className="">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="py-16">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <h1 className="text-6xl font-bold text-white">
                    <StyledMRRText>
                      <span>Meet</span>
                      <br />
                      <span>the Team</span>
                    </StyledMRRText>
                  </h1>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.name}
                  member={member}
                />
              ))}
            </div>

            {/* Collaboration Story */}
            <div className="mb-20">
              <div className="bg-slate-600/5 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <h2 className="text-3xl font-bold text-slate-600">
                      The Perfect Partnership
                    </h2>
                  </div>
                  <p className="text-slate-600/80 text-lg">
                    How human vision meets AI-powered development
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-600/5 rounded-lg p-6 border border-slate-600/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Heart className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-slate-600">
                        Human Vision
                      </h3>
                    </div>
                    <p className="text-slate-600/80 leading-relaxed mb-4">
                      Emīls brings years of enterprise development experience, a
                      deep understanding of user needs, and a passionate vision
                      for transparency in business.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Product strategy and user experience design
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Business logic and feature requirements
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Quality assurance and testing
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-600/5 rounded-lg p-6 border border-slate-600/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Terminal className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-slate-600">
                        AI Development
                      </h3>
                    </div>
                    <p className="text-slate-600/80 leading-relaxed mb-4">
                      bolt.new provides instant development capabilities,
                      intelligent code generation, and seamless deployment -
                      accelerating the development process dramatically.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Rapid prototyping and iteration
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Intelligent code assistance and generation
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-600/70 text-sm">
                          Instant deployment and testing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Team;

const StyledMRRText = styled(MRRText)`
  font-size: 1em;
`;
