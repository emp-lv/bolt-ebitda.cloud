import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Code, Globe, Linkedin, Mail, Star, Zap, Heart, Coffee, Sparkles, Terminal, Rocket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

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
  particleType = 'currency'
}: { 
  width: number;
  height: number;
  colorScheme: { primary: number; secondary: number; range: number };
  particleType?: 'currency' | 'code';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 45;

    const getParticleSign = () => {
      if (particleType === 'code') {
        return ['<', '>', '{', '}', '(', ')', '[', ']', '=', '+', '-', '*', '/', '%'][Math.floor(Math.random() * 13)];
      }
      return ['$', '$', '£', '€', '¥', '₹', '¢'][Math.floor(Math.random() * 7)];
    };

    const getParticleColor = () => {
      const variation = (Math.random() - 0.5) * colorScheme.range;
      return colorScheme.primary + variation;
    };

    const getParticleSize = () => {
      const baseSize = particleType === 'code' ? 1.2 : 1.4;
      const sizeRandomValue = Math.random();
      return baseSize + sizeRandomValue * (sizeRandomValue > 0.8 ? Math.random() * 2.5 : 1.3);
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
          isCent: Math.random() < (particleType === 'code' ? 0.1 : 0.3),
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
        if (particle.x < -20 || particle.x > width + 20 || 
            particle.y < -20 || particle.y > height + 20) {
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
          ctx.font = `bold ${particle.signSize}px ${particleType === 'code' ? 'monospace' : 'sans-serif'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.sign, 0, 0);
        } else if (particle.isCent && particleType === 'currency') {
          // Draw cent (only for currency type)
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.size * 3.5}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('¢', 0, 0);
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
  isFounder = false
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
    particleType?: 'currency' | 'code';
  };
  isFounder?: boolean;
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
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative">
      {isFounder && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Founder</span>
          </div>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 transform hover:scale-105">
        {/* Canvas Header */}
        <div 
          ref={canvasRef}
          className="relative h-48 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden"
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
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center border-2 border-gray-900">
                {member.particleType === 'code' ? (
                  <Code className="w-4 h-4 text-white" />
                ) : (
                  <Zap className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
            <p className="text-blue-400 font-semibold mb-3">{member.role}</p>
            
            {member.location && (
              <div className="flex items-center justify-center space-x-1 text-white/60 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{member.location}</span>
              </div>
            )}
          </div>

          <p className="text-white/80 text-sm leading-relaxed mb-6 text-center">
            {member.description}
          </p>

          {/* Skills */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3 text-sm">Core Skills</h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded-full text-white/80 text-xs border border-white/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3 text-sm">Key Contributions</h4>
            <div className="space-y-2">
              {member.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-white/70 text-xs leading-relaxed">{achievement}</span>
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
                className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors text-sm"
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
                className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
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
      name: 'Emīls Pļavenieks',
      role: 'Founder & Lead Developer',
      description: 'Staff-level frontend engineer from Latvia with a passion for transparency and building tools that solve real problems. Creator of My Earnings and advocate for open business practices.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Latvia',
      website: 'https://emp.lv',
      linkedin: 'https://www.linkedin.com/in/emplv/',
      email: 'emils@emp.lv',
      skills: ['React', 'TypeScript', 'Node.js', 'Full-Stack Development', 'UI/UX Design', 'Product Strategy'],
      achievements: [
        'Built My Earnings from concept to launch as a solo developer',
        'Designed and implemented the interactive particle visualization system',
        'Created a platform that promotes transparency in business',
        'Maintains 100% free access to all features for the community',
        'Staff-level engineering expertise in modern web technologies'
      ],
      colorScheme: { primary: 240, secondary: 260, range: 50 },
      particleType: 'currency' as const
    },
    {
      name: 'bolt.new',
      role: 'Development Platform',
      description: 'The AI-powered development platform by StackBlitz that made rapid prototyping and development of My Earnings possible. Enabling instant full-stack web development in the browser.',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Cloud-based',
      website: 'https://bolt.new',
      linkedin: 'https://www.linkedin.com/company/stackblitz/',
      skills: ['AI Development', 'WebContainers', 'Browser-based IDE', 'Instant Deployment', 'Full-Stack Development', 'Code Generation'],
      achievements: [
        'Enabled rapid prototyping and iteration of My Earnings features',
        'Provided instant development environment without local setup',
        'Facilitated seamless deployment and testing workflows',
        'Powered by Claude Sonnet 4 for intelligent code assistance',
        'Revolutionary browser-based development experience'
      ],
      colorScheme: { primary: 120, secondary: 140, range: 60 },
      particleType: 'code' as const
    }
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="py-16">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="text-center mb-16">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Users className="w-8 h-8 text-blue-400" />
                  <h1 className="text-6xl font-bold text-white">Meet the Team</h1>
                </div>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  The passionate individuals and innovative technology behind My Earnings. 
                  A combination of human creativity and cutting-edge AI development tools.
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {teamMembers.map((member, index) => (
                <TeamMemberCard 
                  key={member.name} 
                  member={member} 
                  isFounder={index === 0}
                />
              ))}
            </div>

            {/* Collaboration Story */}
            <div className="mb-20">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white">The Perfect Partnership</h2>
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-white/80 text-lg">How human vision meets AI-powered development</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Heart className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-bold text-white">Human Vision</h3>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-4">
                      Emīls brings years of enterprise development experience, a deep understanding of user needs, 
                      and a passionate vision for transparency in business.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Product strategy and user experience design</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Business logic and feature requirements</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Quality assurance and testing</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Terminal className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-white">AI Development</h3>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-4">
                      bolt.new provides instant development capabilities, intelligent code generation, 
                      and seamless deployment - accelerating the development process dramatically.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Rapid prototyping and iteration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Intelligent code assistance and generation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">Instant deployment and testing</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                    <p className="text-white/90 text-lg leading-relaxed">
                      "This collaboration represents the future of software development - where human creativity 
                      and AI capabilities combine to build something greater than either could achieve alone."
                    </p>
                    <p className="text-blue-400 mt-3 font-semibold">- Emīls Pļavenieks, Founder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Built With Modern Technology</h2>
                <p className="text-xl text-white/80">The powerful stack behind My Earnings</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { name: 'React', color: 'from-cyan-400 to-cyan-600' },
                  { name: 'TypeScript', color: 'from-blue-400 to-blue-600' },
                  { name: 'Tailwind CSS', color: 'from-teal-400 to-teal-600' },
                  { name: 'Styled Components', color: 'from-pink-400 to-pink-600' },
                  { name: 'Zustand', color: 'from-orange-400 to-orange-600' },
                  { name: 'Vite', color: 'from-purple-400 to-purple-600' },
                  { name: 'Lucide Icons', color: 'from-green-400 to-green-600' },
                  { name: 'Canvas API', color: 'from-yellow-400 to-yellow-600' },
                  { name: 'WebContainers', color: 'from-indigo-400 to-indigo-600' },
                  { name: 'Claude Sonnet 4', color: 'from-red-400 to-red-600' },
                  { name: 'bolt.new', color: 'from-emerald-400 to-emerald-600' },
                  { name: 'StackBlitz', color: 'from-violet-400 to-violet-600' }
                ].map((tech, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center hover:border-white/20 transition-colors">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">{tech.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Us CTA */}
            <div className="text-center bg-gradient-to-r from-blue-50/10 to-purple-50/10 rounded-2xl border border-white/10 p-8 mb-20">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
                <h3 className="text-3xl font-bold text-white">Join Our Mission</h3>
              </div>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                We're building a more transparent business world. Whether you're an entrepreneur, developer, 
                or just someone who believes in transparency, we'd love to have you as part of our community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Start Your Journey</span>
                </button>
                <a
                  href="mailto:emils@emp.lv"
                  className="text-blue-400 hover:text-blue-300 font-semibold px-8 py-4 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Get In Touch</span>
                </a>
              </div>
              
              <div className="mt-6 text-white/60">
                <p>Building transparency, one revenue stream at a time</p>
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