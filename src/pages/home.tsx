import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProfileCard from "../components/profileCard";
import { profiles } from "../data/profiles";
import StreamComponent from "../components/stream/stream";
import { Link } from "react-router-dom";
import { MRRText } from "../components/mrr";
import styled from "styled-components";

function Home() {
  const featuredProfiles = profiles.slice(0, 3);

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-10xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-16 relative h-[928px]">
            <h1 className="text-6xl font-bold text-white mb-10 mt-16">
              <StyledMRRText>
                <span>Transparent</span>
                <br />
                <span>money flow</span>
              </StyledMRRText>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto w-3/12 text-zinc-400">
              Display publicly your revenue streams and business ventures to
              gain trust and credibility.
            </p>
            <MiniStreamWrapper />

            {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  ${totalTargetMrr.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Total Target MRR</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{totalProfiles}</div>
                <div className="text-sm text-white/60">Active Profiles</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{personProfiles}</div>
                <div className="text-sm text-white/60">Personal Profiles</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{companyProfiles}</div>
                <div className="text-sm text-white/60">Company Profiles</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Featured revenue streams */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Featured Revenue Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how successful entrepreneurs and businesses use My Earnings to
              track and optimize their income sources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <ProfileCard profile={profile} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/featured"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
            >
              <span>Explore All Revenue Streams</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function MiniStreamWrapper() {
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const [streamWidth, setStreamWidth] = useState(1280);

  useEffect(() => {
    function handleResize() {
      if (streamContainerRef.current) {
        setStreamWidth(streamContainerRef.current.clientWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [streamContainerRef]);

  return (
    <div
      className="absolute w-full h-[800px] bottom-4"
      ref={streamContainerRef}
    >
      {streamContainerRef.current && (
        <StreamComponent
          key={streamWidth.toString()}
          profile={profiles[0]}
          size={120}
          width={streamWidth}
          height={800}
          profilePositionPercentage={0.65}
          density={0.5}
          hideName={true}
        />
      )}
    </div>
  );
}

const StyledMRRText = styled(MRRText)`
  font-size: 1.2em;
`;

export default Home;
