import React, { useRef, useEffect, useState } from 'react';
import { CreditCard, Euro, Share2 } from 'lucide-react';
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

interface Integration {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  colorScheme: {
    primary: number;
    secondary: number;
    range: number;
  };
}

function IntegrationCanvas({ 
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

    const PARTICLE_COUNT = 40;

    const getParticleSign = () => {
      return ['$', '$', '£', '€', '¥', '₹'][Math.floor(Math.random() * 6)];
    };

    const getParticleColor = () => {
      // Use the specific color scheme for this integration
      const variation = (Math.random() - 0.5) * colorScheme.range;
      return colorScheme.primary + variation;
    };

    const getParticleSize = () => {
      const baseSize = 1.5;
      const sizeRandomValue = Math.random();
      return baseSize + sizeRandomValue * (sizeRandomValue > 0.8 ? Math.random() * 3 : 1.5);
    };

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = getParticleSize();
        const particle: Particle = {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 2,
          size,
          opacity: 0.4 + Math.random() * 0.4,
          hue: getParticleColor(),
          sign: getParticleSign(),
          signSize: 8 + Math.random() * 10 + size * 2,
          isCent: Math.random() < 0.25,
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
          particle.vx = (Math.random() - 0.5) * 1.5;
          particle.vy = (Math.random() - 0.5) * 2;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        const color = `hsla(${particle.hue}, 75%, 65%, ${particle.opacity})`;

        if (particle.size > 2.2) {
          // Draw currency sign
          ctx.fillStyle = color;
          ctx.font = `bold ${particle.signSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.sign, 0, 0);
        } else if (particle.isCent) {
          // Draw cent
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
  }, [width, height, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function IntegrationRow({ integration }: { integration: Integration }) {
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
    <div className="bg-slate-600/5 backdrop-blur-sm rounded-lg border border-slate-600/10 overflow-hidden mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
        {/* Left Section - Canvas with Icon */}
        <div 
          ref={canvasRef}
          className="relative bg-gradient-to-br from-slate-600/5 to-slate-600/10 flex items-center justify-center overflow-hidden"
        >
          {/* Canvas Background */}
          <IntegrationCanvas 
            width={dimensions.width}
            height={dimensions.height}
            colorScheme={integration.colorScheme}
          />
          
          {/* Icon */}
          <div className="relative z-10 w-24 h-24 bg-slate-600/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-600/20">
            <div className="text-slate-600 text-3xl">
              {integration.icon}
            </div>
          </div>
        </div>

        {/* Right Section - Information */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-600">{integration.title}</h3>
            {integration.status === 'coming-soon' && (
              <span className="px-3 py-1 bg-yellow-500/20 text-slate-500 text-sm rounded-full border border-yellow-500/30">
                Coming Soon
              </span>
            )}
          </div>
          
          <p className="text-slate-600/80 text-lg mb-6 leading-relaxed">
            {integration.description}
          </p>

          <div className="space-y-3 mb-6">
            {integration.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-slate-600/90 text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Integrations() {
  const integrations: Integration[] = [
    {
      id: 'stripe',
      title: 'Stripe Integration',
      description: 'Connect your Stripe account to automatically display real-time revenue data and historical transaction information directly in your revenue stream.',
      features: [
        'Real-time revenue tracking from Stripe payments',
        'Historical data import for complete revenue history',
        'Automatic categorization of different revenue sources',
        'Secure OAuth connection with read-only access',
        'Support for multiple Stripe accounts'
      ],
      icon: <CreditCard className="w-8 h-8" />,
      status: 'coming-soon',
      colorScheme: {
        primary: 240, // Blue
        secondary: 260,
        range: 40
      }
    },
    {
      id: 'paypal',
      title: 'PayPal Integration',
      description: 'Sync your PayPal business account to showcase revenue streams from PayPal transactions and subscriptions in your transparency profile.',
      features: [
        'Automatic PayPal transaction syncing',
        'Support for both one-time and recurring payments',
        'Subscription revenue tracking',
        'Secure API integration with PayPal'
      ],
      icon: <Euro className="w-8 h-8" />,
      status: 'coming-soon',
      colorScheme: {
        primary: 200, // Cyan/Teal
        secondary: 180,
        range: 50
      }
    },
    {
      id: 'widget',
      title: 'Shareable Revenue Widget',
      description: 'Create beautiful, embeddable widgets that display your revenue streams on your website, blog, or social media profiles.',
      features: [
        'Customizable widget design and colors',
        'Multiple widget sizes and layouts',
        'Responsive design for all devices',
        'Easy embed code generation',
        'Privacy controls for sensitive data'
      ],
      icon: <Share2 className="w-8 h-8" />,
      status: 'coming-soon',
      colorScheme: {
        primary: 120, // Green
        secondary: 140,
        range: 60
      }
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
                MyEarnings integrations
              </h1>
              <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                Connect your payment platforms and create shareable widgets to automate your revenue transparency and build trust with your audience.
              </p>
            </div>
          </div>

          {/* Integration Rows */}
          <div className="mb-20">
            {integrations.map((integration) => (
              <IntegrationRow key={integration.id} integration={integration} />
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="text-center mb-20 p-8 bg-gradient-to-r from-slate-300/20 to-slate-200/20 rounded-2xl border border-slate-600/10">
            <h3 className="text-2xl font-bold text-slate-600 mb-4">
              All Integrations Coming Soon
            </h3>
            <p className="text-slate-500 mb-6 max-w-2xl mx-auto">
              I will be working on these integrations to make revenue transparency as seamless as possible. After the hackathon judging period.
              Want to be notified when they're ready?
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Integrations;