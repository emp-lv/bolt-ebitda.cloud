import React from "react";
import {
  MapPin,
  Globe,
  Linkedin,
  Star,
  Award,
  Users,
  Coffee,
  Heart,
} from "lucide-react";
import { styled } from "styled-components";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { MRRText } from "../components/mrr";

function About() {
  const values = [
    {
      title: "Transparency First",
      description:
        "I believe that openness creates stronger, more authentic business relationships.",
      icon: <Star className="w-8 h-8 text-yellow-400" />,
    },
    {
      title: "Free for Everyone",
      description:
        "Revenue transparency should be accessible to all entrepreneurs, regardless of their budget.",
      icon: <Heart className="w-8 h-8 text-red-400" />,
    },
    {
      title: "Quality Visuals",
      description:
        "Every feature is built with care, to achieve the best user interface.",
      icon: <Award className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "Community Driven",
      description:
        "The platform evolves based on real user needs and community feedback.",
      icon: <Users className="w-8 h-8 text-green-400" />,
    },
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="">
        <div className="pt-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="pt-16">
              <div className="text-center mb-16">
                <h1 className="text-6xl font-bold mb-12 ">
                  <StyledMRRText>
                    <span>The Story </span>
                    <br />
                    <span>of My Earnings</span>
                  </StyledMRRText>
                </h1>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto">
                  My Earnings is a platform that helps entrepreneurs build trust
                  through transparency.
                </p>
              </div>
            </div>

            {/* Hero Section - Personal Story */}
            <div className="mb-20">
              <div className="bg-slate-900/5 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  {/* Left - Image and Basic Info */}
                  <div className="text-center lg:text-right">
                    <div className="relative inline-block mb-6">
                      <img
                        src="https://avatars.githubusercontent.com/u/16500803?v=4"
                        alt="Emīls Pļavenieks"
                        className="w-48 h-48 rounded-full object-cover border-4 border-slate-400 shadow-2xl"
                      />
                    </div>

                    <h2 className="text-3xl font-bold text-green-400 mb-2">
                      Emīls Pļavenieks
                    </h2>
                    <p className="text-xl text-slate-500 mb-4">
                      Staff Fullstack Engineer
                    </p>

                    <div className="flex items-center justify-center lg:justify-end space-x-4 text-slate-400 mb-6">
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
                    <div className="flex items-center justify-center lg:justify-end space-x-4">
                      <a
                        href="https://emp.lv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-500 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/emplv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-500 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Right - Story */}
                  <div className="space-y-6 lg:col-span-2">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-500 mb-4">
                        The Vision
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        The idea came to me at the start of 2024, when I started
                        to follow many indie devs on x. And I quickly noticed
                        the pattern of the magical 10k MRR. Then I stumbled upon
                        Pieter Levels who had all his indie sites listed on
                        profile with their MRR.
                      </p>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        This made me think that there are many indie devs who
                        would like to transparently share their revenue streams
                        and connections. I purchased the domain and started to
                        read the MAKE book. But, this was all I did. I didn't
                        build anything...
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        But I always had the though of how I would like this
                        site to show the revenue flows with connections. And the
                        hackathon for
                        <strong className="text-green-500">{` bolt.new `}</strong>
                        came at the right time. So, I revived my idea of a site
                        like this. To allow indie devs to share their revenue
                        streams and connections. And do that transparently and
                        for free.
                      </p>
                    </div>

                    <div className="bg-slate-900/5 rounded-lg p-4 border border-slate-800">
                      <p className="text-green-700 italic">
                        "MyEarnings is my move towards transparent revenue
                        sharing and building trust with audience."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-gradient">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-6xl mx-auto">
            {/* Core Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Core Values
                </h2>
                <p className="text-xl text-white/80">
                  What drives every decision we make
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{value.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">
                          {value.title}
                        </h3>
                        <p className="text-white/80 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact & Future */}
            <div className="">
              <div className="bg-gradient-to-r from-green-300 to-yellow-100 rounded-2xl p-8 border border-slate-800">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-600 mb-4">
                    The Impact
                  </h2>
                  <p className="text-slate-500 text-lg">
                    Building a more transparent business world
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-slate-700 mb-2">
                      100%
                    </div>
                    <div className="text-slate-600">Free Forever</div>
                    <div className="text-slate-500 text-sm">
                      No hidden costs or limitations
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-slate-700 mb-2">
                      ∞
                    </div>
                    <div className="text-slate-600">Unlimited Connections</div>
                    <div className="text-slate-500 text-sm">
                      Build your complete network
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-slate-700 mb-2">
                      €
                    </div>
                    <div className="text-slate-600">eu/acc</div>
                    <div className="text-slate-500 text-sm">
                      Europe first
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

export default About;

const StyledMRRText = styled(MRRText)`
  font-size: 1em;
`;
