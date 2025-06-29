import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
} from "@phosphor-icons/react";
import ConnectionCard from "../components/connectionCard";
import ProfileSearch from "../components/profileSearch";
import ConnectionEditModal from "../components/connectionEditModal";
import AddConnectionModal from "../components/addConnectionModal";
import { useUserProfilesStore } from "../store/userProfilesStore";
import { useProfilesStore } from "../store/profilesStore";
import { Profile, CompanyType } from "../types/profile";
import { ConnectionType } from "../types/connection";

function EditProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const {
    updateProfile,
    addConnection,
    updateConnection,
    deleteConnection,
  } = useUserProfilesStore();
  
  const { getProfileById } = useProfilesStore();
  const navigate = useNavigate();

  const profile = (profileId && getProfileById(profileId)) || null;
  const [editedProfile, setEditedProfile] = useState<Profile | null>(profile);
  const [selectedConnection, setSelectedConnection] = useState<{
    connection: ConnectionType;
    type: "source" | "destination";
  } | null>(null);

  // Get user's profiles and connections
  const { userProfiles, getSourceConnections, getDestinationConnections } = useUserProfilesStore();
  const sourceConnections = getSourceConnections(profile?.id || '');
  const destinationConnections = getDestinationConnections(profile?.id || '');

  if (!profile || !editedProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Link
          to="/"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  const handleProfileUpdate = (field: keyof Profile, value: any) => {
    setEditedProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = () => {
    if (editedProfile) {
      updateProfile(profile.id, editedProfile);
      console.log("Profile saved successfully");
    }
  };
}