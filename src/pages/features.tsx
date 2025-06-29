import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Eye, Users, BarChart3, Shield, Zap, Globe, Link as LinkIcon, Target, TrendingUp, Settings, Heart } from 'lucide-react';
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

    const PARTICLE_COUNT = 35;

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
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 transform hover:scale-105">
      {/* Canvas Header */}
      <div 
        ref={canvasRef}
        className="relative h-32 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center overflow-hidden"
      >
        {/* Canvas Background */}
        <FeatureCanvas 
          width={dimensions.width}
          height={dimensions.height}
          colorScheme={feature.colorScheme}
        />
        
        {/* Icon */}
        <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
          <div className="text-white text-2xl">
            {feature.icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{feature.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(feature.category)}`}>
            {feature.category}
          </span>
        </div>
        
        <p className="text-white/80 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        <div className="space-y-2">
          {feature.details.slice(0, 3).map((detail, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span className="text-white/70 text-xs leading-relaxed">{detail}</span>
            </div>
          ))}
          {feature.details.length > 3 && (
            <div className="text-white/60 text-xs">
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
        'Multi-currency support'
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
        'Data export capabilities'
      ],
      icon: <Eye className="w-6 h-6" />,
      category: 'transparency',
      colorScheme: { primary: 120, secondary: 140, range: 60 }
    },
    {
      id: 'business-connections',
      title: 'Business Network',
      description: 'Connect with other transparent businesses and show the flow of revenue between entities.',
      details: [
        'Search and connect with other profiles',
        'Connection request system',
        'Revenue flow visualization',
        'Business relationship mapping',
        'Network discovery features'
      ],
      icon: <Users className="w-6 h-6" />,
      category: 'social',
      colorScheme: { primary: 200, secondary: 180, range: 45 }
    },
    {
      id: 'analytics-insights',
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to understand your revenue patterns and growth trends.',
      details: [
        'Revenue trend analysis',
        'Growth rate calculations',
        'Source performance metrics',
        'Monthly/yearly comparisons',
        'Exportable reports'
      ],
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'analytics',
      colorScheme: { primary: 320, secondary: 340, range: 40 }
    },
    {
      id: 'profile-management',
      title: 'Profile Customization',
      description: 'Create compelling profiles that showcase your business story and revenue transparency.',
      details: [
        'Rich profile descriptions',
        'Custom profile images',
        'Business type categorization',
        'Target MRR goal setting',
        'Social media integration'
      ],
      icon: <Settings className="w-6 h-6" />,
      category: 'core',
      colorScheme: { primary: 60, secondary: 80, range: 50 }
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy',
      description: 'Enterprise-grade security measures to protect your sensitive business information.',
      details: [
        'End-to-end data encryption',
        'Secure authentication system',
        'GDPR compliance',
        'Regular security audits',
        'Data backup and recovery'
      ],
      icon: <Shield className="w-6 h-6" />,
      category: 'transparency',
      colorScheme: { primary: 160, secondary: 180, range: 35 }
    },
    {
      id: 'public-profiles',
      title: 'Public Discovery',
      description: 'Get discovered by potential partners, customers, and investors through public profiles.',
      details: [
        'Public profile directory',
        'Search and filter capabilities',
        'Featured profile showcases',
        'SEO-optimized profile pages',
        'Social sharing features'
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
        'Motivational progress tracking'
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
        'QR code generation',
        'Click tracking and analytics'
      ],
      icon: <LinkIcon className="w-6 h-6" />,
      category: 'social',
      colorScheme: { primary: 260, secondary: 280, range: 40 }
    },
    {
      id: 'community-support',
      title: 'Community & Support',
      description: 'Join a community of transparent entrepreneurs and get support when you need it.',
      details: [
        'Community forums and discussions',
        'Best practices sharing',
        'Success story showcases',
        'Direct creator communication',
        'Feature request system'
      ],
      icon: <Heart className="w-6 h-6" />,
      category: 'social',
      colorScheme: { primary: 340, secondary: 360, range: 30 }
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

  const categories = [
    { id: 'core', name: 'Core Features', color: 'text-blue-400' },
    { id: 'transparency', name: 'Transparency', color: 'text-green-400' },
    { id: 'analytics', name: 'Analytics', color: 'text-purple-400' },
    { id: 'social', name: 'Social & Sharing', color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />

      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              <h1 className="text-6xl font-bold text-white mb-6">
                Powerful Features for Revenue Transparency
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Everything you need to build trust through transparency. Create beautiful revenue streams, 
                connect with other businesses, and showcase your financial journey.
              </p>
              
              {/* Category Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      category.id === 'core' ? 'from-blue-500 to-blue-600' :
                      category.id === 'transparency' ? 'from-green-500 to-green-600' :
                      category.id === 'analytics' ? 'from-purple-500 to-purple-600' :
                      'from-orange-500 to-orange-600'
                    }`}></div>
                    <span className={`text-sm font-medium ${category.color}`}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mb-20 p-8 bg-gradient-to-r from-blue-50/10 to-purple-50/10 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Transparency Journey?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of entrepreneurs who are building trust and credibility through revenue transparency. 
              Start for free today with full access to all features.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-lg">
                Create Your Profile
              </button>
              <Link 
                to="/featured"
                className="text-blue-400 hover:text-blue-300 font-semibold px-8 py-4 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-colors text-lg"
              >
                View Examples
              </Link>
            </div>
            
            <div className="mt-6 text-white/60 text-sm">
              ✨ Completely free forever • No credit card required • Start in minutes
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Features;