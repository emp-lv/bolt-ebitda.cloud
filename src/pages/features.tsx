import React, { useRef, useEffect, useState } from 'react';
import { Eye, Zap, Globe, Link as LinkIcon, Target, TrendingUp, Settings } from 'lucide-react';
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

interface Feature {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  colorScheme: {
    primary: number;
    secondary: number;
    range: number;
  };
  category: 'core' | 'transparency' | 'analytics' | 'social';
}

function FeatureCanvas({ 
  width, 
  height,
  colorScheme
}: { 
  width: number;
  height: number;
  colorScheme: { primary: number; secondary: number; range: number };
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

    const PARTICLE_COUNT = 15;

    const getParticleSign = () => {
      return ['$', '$', '£', '€', '¥', '₹', '¢'][Math.floor(Math.random() * 7)];
    };

    const getParticleColor = () => {
      const variation = (Math.random() - 0.5) * colorScheme.range;
      return colorScheme.primary + variation;
    };

    const getParticleSize = () => {
      const baseSize = 1.3;
      const sizeRandomValue = Math.random();
      return baseSize + sizeRandomValue * (sizeRandomValue > 0.85 ? Math.random() * 3 : 1.2);
    };

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = getParticleSize();
        const particle: Particle = {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.8,
          size,
          opacity: 0.35 + Math.random() * 0.4,
          hue: getParticleColor(),
          sign: getParticleSign(),
          signSize: 7 + Math.random() * 8 + size * 1.8,
          isCent: Math.random() < 0.3,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
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
          particle.vx = (Math.random() - 0.5) * 1.2;
          particle.vy = (Math.random() - 0.5) * 1.8;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        const color = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;

        if (particle.size > 2.1) {
          // Draw currency sign
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.signSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.sign, 0, 0);
        } else if (particle.isCent) {
          // Draw cent
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.size * 3.2}px sans-serif`;
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
  }, [width, height, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'transparency': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'analytics': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'social': return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="bg-slate-600/5 backdrop-blur-sm rounded-lg border border-slate-600/10 overflow-hidden hover:border-slate-600/20 transition-all duration-300 transform hover:scale-105">
      {/* Canvas Header */}
      <div 
        ref={canvasRef}
        className="relative h-32 bg-gradient-to-br from-slate-600/5 to-slate-600/10 flex items-center justify-center overflow-hidden"
      >
        {/* Canvas Background */}
        <FeatureCanvas 
          width={dimensions.width}
          height={dimensions.height}
          colorScheme={feature.colorScheme}
        />
        
        {/* Icon */}
        <div className="relative z-10 w-16 h-16 bg-slate-600/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-600/20">
          <div className="text-slate-600 text-2xl">
            {feature.icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-600">{feature.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(feature.category)}`}>
            {feature.category}
          </span>
        </div>
        
        <p className="text-slate-600/80 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        <div className="space-y-2">
          {feature.details.slice(0, 3).map((detail, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="text-slate-600/70 text-xs leading-relaxed">{detail}</span>
            </div>
          ))}
          {feature.details.length > 3 && (
            <div className="text-slate-600/60 text-xs">
              +{feature.details.length - 3} more features
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features: Feature[] = [
    {
      id: 'revenue-tracking',
      title: 'Revenue Stream Tracking',
      description: 'Create and manage multiple income sources with detailed tracking and categorization.',
      details: [
        'Unlimited income source connections',
        'Custom revenue categorization',
        'Historical data tracking',
        'Real-time updates and notifications',
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'core',
      colorScheme: { primary: 240, secondary: 260, range: 40 }
    },
    {
      id: 'visual-streams',
      title: 'Interactive Visual Streams',
      description: 'Beautiful particle-based visualizations that show money flow between your revenue sources.',
      details: [
        'Real-time particle animations',
        'Interactive drag-and-drop positioning',
        'Customizable visual themes',
        'Responsive design for all devices',
        'Smooth 60fps animations'
      ],
      icon: <Zap className="w-6 h-6" />,
      category: 'core',
      colorScheme: { primary: 280, secondary: 300, range: 50 }
    },
    {
      id: 'transparency-controls',
      title: 'Transparency Controls',
      description: 'Fine-grained privacy controls to decide what information you want to share publicly.',
      details: [
        'Public/private connection settings',
        'Selective revenue amount disclosure',
        'Profile visibility controls',
        'Connection approval system',
      ],
      icon: <Eye className="w-6 h-6" />,
      category: 'transparency',
      colorScheme: { primary: 120, secondary: 140, range: 60 }
    },
    {
      id: 'profile-management',
      title: 'Profile Customization',
      description: 'Create compelling profiles that showcase your business story and revenue transparency.',
      details: [
        'Rich profile descriptions',
        'Custom profile images',
        'Business type categorization',
        'Target MRR goal setting'
      ],
      icon: <Settings className="w-6 h-6" />,
      category: 'core',
      colorScheme: { primary: 60, secondary: 80, range: 50 }
    },
    {
      id: 'public-profiles',
      title: 'Public Discovery',
      description: 'Get discovered by potential partners, customers, and investors through public profiles.',
      details: [
        'Public profile directory',
        'Search and filter capabilities',
        'Featured profile showcases',
      ],
      icon: <Globe className="w-6 h-6" />,
      category: 'social',
      colorScheme: { primary: 100, secondary: 120, range: 55 }
    },
    {
      id: 'goal-tracking',
      title: 'Goal Setting & Tracking',
      description: 'Set revenue targets and track your progress with visual indicators and milestones.',
      details: [
        'Custom MRR goal setting',
        'Progress visualization',
        'Milestone celebrations',
        'Goal achievement analytics',
      ],
      icon: <Target className="w-6 h-6" />,
      category: 'analytics',
      colorScheme: { primary: 20, secondary: 40, range: 45 }
    },
    {
      id: 'shareable-links',
      title: 'Shareable Revenue Links',
      description: 'Generate beautiful shareable links to showcase your revenue transparency anywhere.',
      details: [
        'Custom shareable URLs',
        'Social media optimized previews',
        'Embeddable widgets',
        'Click tracking and analytics'
      ],
      icon: <LinkIcon className="w-6 h-6" />,
      category: 'social',
      colorScheme: { primary: 260, secondary: 280, range: 40 }
    },
    {
      id: 'free-forever',
      title: 'Free Forever',
      description: 'All features are completely free with no limitations, subscriptions, or hidden costs.',
      details: [
        'No monthly subscription fees',
        'Unlimited connections and features',
        'No time restrictions',
        'Full access to all capabilities',
        'Optional sponsor tier for support'
      ],
      icon: <Zap className="w-6 h-6" />,
      category: 'core',
      colorScheme: { primary: 80, secondary: 100, range: 60 }
    }
  ];

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />

      <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-noise">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="py-16">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold text-slate-600 mb-6">
                <span className="text-slate-700">Features</span> for Revenue Transparency
              </h1>
              <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
                Everything you need to build trust through transparency. Create beautiful revenue streams, 
                connect with other businesses, and showcase your financial journey.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Features;