import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import StreamComponent from "../components/stream/stream";
import { getProfileById } from "../data/profiles";

function Stream() {
  const { profileId } = useParams<{ profileId: string }>();
  const profile = profileId ? getProfileById(profileId) : null;

  if (!profile) {
    return (
      <Container>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Profile Not Found
            </h1>
            <p className="text-white/80 mb-8">
              The profile you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="stream-page-bg">
      <Navbar profile={profile} showEditButton={true} />
      <StreamComponent
        mrr={
          profile.currentMrr ? Math.floor(profile.currentMrr / 1000) : undefined
        }
        profile={profile}
      />
    </Container>
  );
}

const Container = styled.div<{ className?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;

export default Stream;
