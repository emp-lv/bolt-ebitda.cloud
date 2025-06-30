import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Privacy() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="py-16">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-green-400" />
                <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
              </div>
              
              <p className="text-lg text-white/80 mb-2">
                Your privacy matters to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-white/60">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12 mb-20">
              {/* Information We Collect */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Account Information</h3>
                    <p className="text-sm leading-relaxed">
                      When you create an account, we collect your name, email address, and profile information you choose to provide.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Revenue Stream Data</h3>
                    <p className="text-sm leading-relaxed">
                      Information about your income sources, target MRR, and connections you create within the platform.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Usage Information</h3>
                    <p className="text-sm leading-relaxed">
                      We collect information about how you use our service, including pages visited and features used.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Eye className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
                </div>
                
                <div className="space-y-3 text-white/80">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Provide and maintain our revenue transparency platform</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Enable connections between profiles and revenue streams</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Send important updates about your account and our service</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Improve our platform and develop new features</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Ensure security and prevent fraud</p>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-semibold text-white">Information Sharing</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Public Information</h3>
                    <p className="text-sm leading-relaxed">
                      Information you choose to make public (profile details, revenue streams) is visible to other users and may be indexed by search engines.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Service Providers</h3>
                    <p className="text-sm leading-relaxed">
                      We may share information with trusted service providers who help us operate our platform, subject to confidentiality agreements.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Legal Requirements</h3>
                    <p className="text-sm leading-relaxed">
                      We may disclose information when required by law or to protect our rights and the safety of our users.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-semibold text-white">Data Security</h2>
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Encryption</h4>
                    <p className="text-white/70 text-sm">Data encrypted in transit and at rest</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Access Controls</h4>
                    <p className="text-white/70 text-sm">Limited access on need-to-know basis</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Regular Audits</h4>
                    <p className="text-white/70 text-sm">Security practices reviewed regularly</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Incident Response</h4>
                    <p className="text-white/70 text-sm">Rapid response to security incidents</p>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
                  <div>
                    <h3 className="text-white font-medium mb-2">Access & Portability</h3>
                    <p className="text-sm">Request a copy of your personal data in a portable format</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Correction</h3>
                    <p className="text-sm">Update or correct inaccurate personal information</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Deletion</h3>
                    <p className="text-sm">Request deletion of your personal data (subject to legal requirements)</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Restriction</h3>
                    <p className="text-sm">Limit how we process your personal information</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Privacy;