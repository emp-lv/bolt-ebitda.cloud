import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProfileCard from "../components/profileCard";
import { useProfilesStore } from "../store/profilesStore";
import StreamComponent from "../components/stream/stream";
import { Link } from "react-router-dom";
import { MRRText } from "../components/mrr";
import styled from "styled-components";

function Home() {
  const { getFeaturedProfiles } = useProfilesStore();
  const featuredProfiles = getFeaturedProfiles().slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-10xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-8 relative h-[1028px]">
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
          </div>
        </div>
      </div>

      {/* Featured revenue streams */}
      <div className="bg-dark-gradient">
        <div className="px-4 sm:px-6 lg:px-8 py-20 bg-noise">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-accent mb-6">
                Featured Revenue Flows
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
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
                className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-semibold text-lg transition-colors"
              >
                <span>Explore All Revenue Streams</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
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
  const { getPublicProfiles } = useProfilesStore();

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
          profile={getPublicProfiles()[0]}
          size={120}
          width={streamWidth}
          height={800}
          profilePositionPercentage={0.65}
          density={300}
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
