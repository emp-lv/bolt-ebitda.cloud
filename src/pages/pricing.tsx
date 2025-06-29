import React, { useRef, useEffect } from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LiquidGlass from '../components/liquidGlass';

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

function PricingCanvas({ 
  width, 
  height 
}: { 
  width: number;
  height: number;
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

    const PARTICLE_COUNT = 80;

    const getParticleSign = () => {
      return ['$', '$', '£', '€', '€', '¥', '₹'][Math.floor(Math.random() * 7)];
    };

    const getParticleColor = () => {
      // Rich colorful colors for sponsor
      return Math.random() * 360;
    };

    const getParticleSize = () => {
      const baseSize = 1.8;
      const sizeRandomValue = Math.random();
      return baseSize + sizeRandomValue * (sizeRandomValue > 0.8 ? Math.random() * 4 : 2);
    };

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = getParticleSize();
        const particle: Particle = {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 3,
          size,
          opacity: 0.3 + Math.random() * 0.5,
          hue: getParticleColor(),
          sign: getParticleSign(),
          signSize: 8 + Math.random() * 12 + size * 2,
          isCent: Math.random() < 0.3,
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

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Reset particles that go out of bounds
        if (particle.x < -20 || particle.x > width + 20 || 
            particle.y < -20 || particle.y > height + 20) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 3;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        // Rich colors for sponsor
        const color = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;

        if (particle.size > 2.5) {
          // Draw currency sign
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.signSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.sign, 0, 0);
        } else if (particle.isCent) {
          // Draw cent
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.size * 4}px sans-serif`;
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
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function PricingCard({ 
  tier, 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonVariant = 'primary',
  showCanvas = false
}: {
  tier: 'free' | 'sponsor';
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary';
  showCanvas?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative">
      <LiquidGlass>
        <div ref={cardRef} className="relative p-8 h-full min-h-[600px] overflow-hidden">
          {/* Canvas Background - only for sponsor tier */}
          {showCanvas && (
            <PricingCanvas 
              width={dimensions.width}
              height={dimensions.height}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <div className="text-4xl font-bold text-white mb-2">
                {price}
                {price !== 'Free' && <span className="text-lg font-normal text-white/80">/month</span>}
              </div>
              <p className="text-white/80">{description}</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-white/90 text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                buttonVariant === 'primary'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
              }`}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
}

function Pricing() {
  const freeFeatures = [
    'Complete access to all features',
    'Unlimited income source connections',
    'Unlimited destination connections',
    'Public profile visibility',
    'Revenue stream tracking and analytics',
    'Connect with other transparent businesses',
    'Export your data anytime',
    'No time limits or restrictions'
  ];

  const sponsorFeatures = [
    'Everything in the free version',
    'Support the creator and development',
    'Custom profile URL (your-name.myearnings.online)',
    'Choose your unique username or brand name',
    'Priority feature requests',
    'Direct communication with the creator',
    'Early access to new features',
    'Special sponsor badge on your profile'
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center py-16">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <span>← Back to Home</span>
              </Link>
              
              <h1 className="text-6xl font-bold text-white mb-6">
                Completely Free to Use
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-4">
                My Earnings is 100% free with no monthly subscriptions, hidden fees, or feature limitations. 
                The sponsor tier is simply a way to support the creator.
              </p>
              <p className="text-white/60 max-w-2xl mx-auto">
                Build trust through transparency without any cost barriers. Everyone deserves access to these tools.
              </p>
            </div>
  
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
              <PricingCard
                tier="free"
                title="Free Forever"
                price="Free"
                description="Full access to all features with no limitations"
                features={freeFeatures}
                buttonText="Start Using Now"
                buttonVariant="secondary"
                showCanvas={false}
              />
              
              <PricingCard
                tier="sponsor"
                title="Sponsor"
                price="$29"
                description="Support the creator and get a custom profile URL"
                features={sponsorFeatures}
                buttonText="Become a Sponsor"
                buttonVariant="primary"
                showCanvas={true}
              />
            </div>
  
            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mb-20">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Is it really completely free?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Yes! There are no monthly subscriptions, hidden fees, or feature limitations. 
                    You get full access to all functionality forever.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    What does the sponsor tier include?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Sponsors get a custom profile URL (like yourname.myearnings.online) and help support 
                    the continued development of the platform.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Are there any connection limits?
                  </h3>
                  <p className="text-white/80 text-sm">
                    No limits at all! Connect to unlimited income sources and destinations. 
                    Build your complete revenue transparency network.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Will it always be free?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Yes! The core platform will always remain free. The sponsor tier is optional 
                    and only for those who want to support the project.
                  </p>
                </div>
              </div>
            </div>
  
            {/* CTA Section */}
            <div className="text-center mb-20 p-8 bg-gradient-to-r from-blue-50/10 to-purple-50/10 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Build Trust Through Transparency?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Start sharing your revenue streams today. No signup fees, no monthly costs, no limitations.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Start Free Today
                </button>
                <Link 
                  to="/featured"
                  className="text-blue-400 hover:text-blue-300 font-semibold px-8 py-3 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-colors"
                >
                  View Examples
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Pricing;