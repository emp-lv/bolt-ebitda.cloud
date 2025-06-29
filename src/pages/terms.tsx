import React from 'react';
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Terms() {
  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-noise">
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
                <FileText className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold text-white">Terms and Conditions</h1>
              </div>
              
              <p className="text-lg text-white/80 mb-2">
                These terms govern your use of My Earnings and the services we provide.
              </p>
              <p className="text-sm text-white/60">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12 mb-20">
              {/* Acceptance of Terms */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Scale className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-semibold text-white">Acceptance of Terms</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <p>
                    By accessing and using My Earnings ("the Service"), you accept and agree to be bound by these Terms and Conditions. 
                    If you do not agree to these terms, please do not use our service.
                  </p>
                  <p>
                    We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </section>

              {/* Service Description */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">Service Description</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <p>
                    My Earnings is a platform that enables users to create transparent revenue stream profiles, 
                    connect with other users, and share business financial information publicly.
                  </p>
                  <p>
                    The service includes profile creation, revenue tracking, connection management, and analytics features. 
                    We reserve the right to modify, suspend, or discontinue any part of the service at any time.
                  </p>
                </div>
              </section>

              {/* User Responsibilities */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-semibold text-white">User Responsibilities</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Account Security</h3>
                    <p className="text-sm leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Accurate Information</h3>
                    <p className="text-sm leading-relaxed">
                      You agree to provide accurate, current, and complete information and to update it as necessary to maintain its accuracy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Lawful Use</h3>
                    <p className="text-sm leading-relaxed">
                      You agree to use the service only for lawful purposes and in accordance with these terms and applicable laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* Prohibited Activities */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-semibold text-white">Prohibited Activities</h2>
                </div>
                
                <div className="space-y-3 text-white/80">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Posting false, misleading, or fraudulent financial information</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Attempting to gain unauthorized access to other users' accounts</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Using the service to harass, abuse, or harm other users</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Distributing malware, viruses, or other harmful code</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">Violating any applicable laws or regulations</p>
                  </div>
                </div>
              </section>

              {/* Content and Intellectual Property */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Content and Intellectual Property</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Your Content</h3>
                    <p>
                      You retain ownership of content you post on the service. By posting content, you grant us a license to use, 
                      display, and distribute it as necessary to provide the service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Our Content</h3>
                    <p>
                      The service and its original content, features, and functionality are owned by SIA EMP and are protected 
                      by international copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* Disclaimers and Limitations */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-semibold text-white">Disclaimers and Limitations</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Service Availability</h3>
                    <p>
                      The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Financial Information</h3>
                    <p>
                      We do not verify the accuracy of financial information posted by users. Users are responsible for the accuracy of their own data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Limitation of Liability</h3>
                    <p>
                      Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, 
                      or consequential damages arising from your use of the service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Gavel className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-semibold text-white">Termination</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <p>
                    You may terminate your account at any time by contacting us. We may terminate or suspend your account 
                    immediately if you violate these terms.
                  </p>
                  <p>
                    Upon termination, your right to use the service ceases immediately. We may retain certain information 
                    as required by law or for legitimate business purposes.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Scale className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">Governing Law</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <p>
                    These terms are governed by the laws of Latvia. Any disputes arising from these terms or your use of the service 
                    will be resolved in the courts of Latvia.
                  </p>
                  <p>
                    If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-semibold text-white">Contact Information</h2>
                </div>
                
                <div className="space-y-4 text-white/80 text-sm leading-relaxed">
                  <p>
                    If you have questions about these Terms and Conditions, please contact us:
                  </p>
                  
                  <div className="space-y-2 text-white/70">
                    <p>Email: legal@myearnings.online</p>
                    <p>Company: SIA EMP</p>
                    <p>Address: Latvia</p>
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

export default Terms;