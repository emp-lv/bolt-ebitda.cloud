import React from 'react';
import { ArrowLeft, MapPin, Code, Globe, Linkedin, Github, Mail, Star, Award, Users, Coffee, Heart, Lightbulb, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function About() {
  const journey = [
    {
      year: '2020',
      title: 'The Problem',
      description: 'Noticed how hard it was for entrepreneurs to build trust and credibility with their audience.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      year: '2022',
      title: 'The Vision',
      description: 'Realized that transparency could be the key to building authentic business relationships.',
      icon: <Target className="w-6 h-6" />
    },
    {
      year: '2024',
      title: 'The Solution',
      description: 'Started building My Earnings to make revenue transparency accessible to everyone.',
      icon: <Code className="w-6 h-6" />
    },
    {
      year: '2025',
      title: 'The Mission',
      description: 'Launching a platform that helps thousands of entrepreneurs build trust through transparency.',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const values = [
    {
      title: 'Transparency First',
      description: 'We believe that openness creates stronger, more authentic business relationships.',
      icon: <Star className="w-8 h-8 text-yellow-400" />
    },
    {
      title: 'Free for Everyone',
      description: 'Revenue transparency should be accessible to all entrepreneurs, regardless of their budget.',
      icon: <Heart className="w-8 h-8 text-red-400" />
    },
    {
      title: 'Quality Craftsmanship',
      description: 'Every feature is built with care, following best practices and modern design principles.',
      icon: <Award className="w-8 h-8 text-blue-400" />
    },
    {
      title: 'Community Driven',
      description: 'The platform evolves based on real user needs and community feedback.',
      icon: <Users className="w-8 h-8 text-green-400" />
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
                <h1 className="text-6xl font-bold text-white mb-6">
                  The Story Behind My Earnings
                </h1>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  How one developer's vision for transparency is changing the way entrepreneurs build trust with their audience.
                </p>
              </div>
            </div>

            {/* Hero Section - Personal Story */}
            <div className="mb-20">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left - Image and Basic Info */}
                  <div className="text-center lg:text-left">
                    <div className="relative inline-block mb-6">
                      <img 
                        src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400"
                        alt="Emīls Pļavenieks"
                        className="w-48 h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center border-4 border-gray-900">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2">Emīls Pļavenieks</h2>
                    <p className="text-xl text-blue-400 mb-4">Staff Frontend Engineer & Solo Entrepreneur</p>
                    
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-white/60 mb-6">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Latvia</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coffee className="w-4 h-4" />
                        <span>Full-Stack Developer</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center lg:justify-start space-x-4">
                      <a
                        href="https://emp.lv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/emplv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href="mailto:emils@emp.lv"
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </a>
                    </div>
                  </div>

                  {/* Right - Story */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">The Vision</h3>
                      <p className="text-white/80 leading-relaxed mb-4">
                        As a staff-level frontend engineer with years of experience building enterprise applications, 
                        I've always been passionate about creating tools that solve real problems. But it wasn't until 
                        I started my own entrepreneurial journey that I discovered a critical gap in how we build trust online.
                      </p>
                      <p className="text-white/80 leading-relaxed mb-4">
                        Traditional methods of proving business success often feel inauthentic or inaccessible to smaller entrepreneurs. 
                        Screenshots can be faked, testimonials can be bought, and complex financial reports are hard to understand.
                      </p>
                      <p className="text-white/80 leading-relaxed">
                        That's when I realized: <strong className="text-white">transparency creates trust</strong>. 
                        By openly sharing revenue streams and business connections, entrepreneurs can build genuine 
                        relationships with their audience and inspire others on their journey.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-blue-300 italic">
                        "My Earnings isn't just a platform—it's a movement towards more honest, 
                        transparent business practices that benefit everyone."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">The Journey</h2>
                <p className="text-xl text-white/80">From problem to solution</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {journey.map((step, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                      {step.icon}
                    </div>
                    <div className="text-blue-400 font-bold text-lg mb-2">{step.year}</div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Expertise */}
            <div className="mb-20">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Technical Expertise</h2>
                  <p className="text-white/80">Built with enterprise-grade development practices</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Frontend Mastery</h3>
                    <p className="text-white/70 text-sm mb-3">React, TypeScript, Modern CSS, Performance Optimization</p>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Full-Stack Development</h3>
                    <p className="text-white/70 text-sm mb-3">Node.js, Databases, APIs, Cloud Deployment</p>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">User Experience</h3>
                    <p className="text-white/70 text-sm mb-3">UI/UX Design, Accessibility, User Research</p>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Core Values</h2>
                <p className="text-xl text-white/80">What drives every decision we make</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                        <p className="text-white/80 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact & Future */}
            <div className="mb-20">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">The Impact</h2>
                  <p className="text-white/80 text-lg">Building a more transparent business world</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
                    <div className="text-white/80">Free Forever</div>
                    <div className="text-white/60 text-sm">No hidden costs or limitations</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
                    <div className="text-white/80">Unlimited Connections</div>
                    <div className="text-white/60 text-sm">Build your complete network</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
                    <div className="text-white/80">Solo Developer</div>
                    <div className="text-white/60 text-sm">Passionate about quality</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
                    My goal is simple: help entrepreneurs build trust through transparency. 
                    Every feature is designed with this mission in mind, and the platform will always remain 
                    free because I believe everyone deserves access to these tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-20">
              <h3 className="text-3xl font-bold text-white mb-4">Let's Connect</h3>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Have questions about the platform? Want to share your transparency story? 
                Or just want to say hello? I'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:emils@emp.lv"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send me an email</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/emplv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold px-8 py-4 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-colors flex items-center space-x-2"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
              
              <div className="mt-6 text-white/60">
                <p>Usually responds within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;