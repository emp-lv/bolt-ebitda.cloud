import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Building2,
  Target,
  Calendar,
  Plus,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  HelpCircle,
  ChevronDown,
  Settings,
} from "lucide-react";
import Navbar from "../components/navbar";
import ConnectionCard from "../components/connectionCard";
import ProfileSearch from "../components/profileSearch";
import ConnectionEditModal from "../components/connectionEditModal";
import AddConnectionModal from "../components/addConnectionModal";
import { useUserProfilesStore } from "../store/userProfilesStore";
import { useProfilesStore } from "../store/profilesStore";
import { useAuth } from "../hooks/useAuth";
import { Profile, CompanyType } from "../types/profile";
import { ConnectionType } from "../types/connection";
import { useEffect } from "react";

function EditProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    getProfileById: getUserProfile,
    updateProfile,
    getSourceConnections,
    getDestinationConnections,
    addConnection,
    updateConnection,
    deleteConnection,
    userProfiles,
  } = useUserProfilesStore();
  
  const { getProfileById: getGlobalProfile } = useProfilesStore();
  
  // Get the profile from user profiles first, then from global profiles
  const userOwnedProfile = profileId ? getUserProfile(profileId) : null;
  const globalProfile = profileId ? getGlobalProfile(profileId) : null;
  const profile = userOwnedProfile || globalProfile;

  const [editedProfile, setEditedProfile] = useState<Profile | null>(profile);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [editingConnection, setEditingConnection] = useState<{
    connection: any;
    type: "source" | "destination";
    profileName: string;
  } | null>(null);
  const [addingConnection, setAddingConnection] = useState<{
    profile: Profile;
    type: "source" | "destination";
  } | null>(null);

  // Validate ownership and authentication
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
      return;
    }
    
    // Redirect if profile doesn't exist
    if (!profile) {
      navigate('/', { replace: true });
      return;
    }
    
    // Redirect if profile is not owned by the user
    if (!userOwnedProfile) {
      navigate(`/profile/${profileId}`, { replace: true });
      return;
    }
  }, [isAuthenticated, profile, userOwnedProfile, profileId, navigate]);

  // Get user's profiles (for demo, we'll show all profiles as if they belong to the user)
  const allUserProfiles = userProfiles;
  if (!profile || !editedProfile) {
    return (
      <div className="min-h-screen relative home-page-bg">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {!isAuthenticated 
                ? "Please Sign In" 
                : !profile 
                  ? "Profile Not Found" 
                  : "You don't have permission to edit this profile"}
            </h1>
            <p className="text-white/80 mb-8">
              {!isAuthenticated 
                ? "You need to be signed in to edit profiles." 
                : !profile 
                  ? "The profile you're trying to edit doesn't exist." 
                  : "You can only edit profiles that belong to you."}
            </p>
            <Link
              to={!isAuthenticated ? "/signin" : "/"}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{!isAuthenticated ? "Sign In" : "Back to Home"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sourceConnections = getSourceConnections(profile.id);
  const destinationConnections = getDestinationConnections(profile.id);

  const handleProfileUpdate = (field: keyof Profile, value: any) => {
    setEditedProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = () => {
    if (editedProfile) {
      updateProfile(profile.id, editedProfile);
      console.log("Profile saved successfully");
    }
  };

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    console.log("Image upload functionality would be implemented here");
    alert("Image upload functionality would be implemented here");
  };

  const handleSourceConnect = (targetProfile: Profile) => {
    setAddingConnection({ profile: targetProfile, type: "source" });
  };

  const handleDestinationConnect = (targetProfile: Profile) => {
    setAddingConnection({ profile: targetProfile, type: "destination" });
  };

  const handleConnectionEdit = (
    connection: any,
    type: "source" | "destination"
  ) => {
    const otherProfileId =
      type === "source"
        ? connection.sourceProfileId
        : connection.destinationProfileId;
    const otherProfile = getUserProfile(otherProfileId) || getGlobalProfile(otherProfileId);
    if (otherProfile) {
      setEditingConnection({
        connection,
        type,
        profileName: otherProfile.name,
      });
    }
  };

  const handleAddConnection = (data: {
    type: ConnectionType;
    net: number;
    public: boolean;
    showNet: boolean;
  }) => {
    if (!addingConnection) return;

    const connectionData = {
      createdAt: Date.now(),
      initiatedBy: profile.id,
      sourceProfileId:
        addingConnection.type === "source"
          ? addingConnection.profile.id
          : profile.id,
      destinationProfileId:
        addingConnection.type === "source"
          ? profile.id
          : addingConnection.profile.id,
      type: data.type,
      status:
        addingConnection.type === "source"
          ? ("pending" as const)
          : ("approved" as const),
      net: data.net,
      public: data.public,
      showNet: data.showNet,
    };

    addConnection(connectionData);
  };

  const companyTypes: CompanyType[] = [
    "SaaS",
    "Agency",
    "Retail",
    "Royalties",
    "Newsletter",
    "Other",
  ];

  return (
    <div className="min-h-screen relative home-page-bg">
      <Navbar profile={profile} />

      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between py-8">
            <div className="flex items-center space-x-4">
              <Link
                to={`/profile/${profile.id}`}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Stream</span>
              </Link>
              <div className="w-px h-6 bg-white/20" />
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/settings"
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>User Settings</span>
              </Link>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Current Profile</h2>
                  <p className="text-white/60">Switch between your profiles to edit different businesses or personal accounts</p>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors border border-white/20"
                  >
                    <img 
                      src={profile.image} 
                      alt={profile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-xs text-white/60">{profile.type === 'person' ? 'Personal' : 'Company'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showProfileDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                        <div className="p-2">
                          {allUserProfiles.map((userProfile) => (
                            <Link
                              key={userProfile.id}
                              to={`/profile/${userProfile.id}/edit`}
                              onClick={() => setShowProfileDropdown(false)}
                              className={`flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-colors ${
                                userProfile.id === profile.id ? 'bg-white/10 border border-white/20' : ''
                              }`}
                            >
                              <img 
                                src={userProfile.image} 
                                alt={userProfile.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  {userProfile.type === 'person' ? (
                                    <User className="w-4 h-4 text-blue-400" />
                                  ) : (
                                    <Building2 className="w-4 h-4 text-purple-400" />
                                  )}
                                  <span className="text-white font-medium truncate">
                                    {userProfile.name}
                                  </span>
                                  {userProfile.id === profile.id && (
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/60 text-sm truncate">
                                  {userProfile.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-white/10 p-2">
                          <button className="w-full flex items-center space-x-2 p-3 hover:bg-white/10 rounded-lg transition-colors text-blue-400">
                            <Plus className="w-4 h-4" />
                            <span>Create New Profile</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Profile Image and Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        Profile Image
                      </label>
                      <div className="flex space-x-3 items-center">
                        <img
                          src={editedProfile.image}
                          alt={editedProfile.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                          onClick={handleImageUpload}
                        />
                        <button
                          onClick={handleImageUpload}
                          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Change</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) =>
                        handleProfileUpdate("name", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={editedProfile.description}
                      onChange={(e) =>
                        handleProfileUpdate("description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                    />
                  </div>

                  <div
                    className={`grid grid-cols-1 md:grid-cols-${
                      editedProfile.email ? 2 : 1
                    } gap-6`}
                  >
                    {/* Created Date (read-only) */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Created Date
                      </label>
                      <div className="flex items-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(editedProfile.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    {editedProfile.email && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="text"
                          disabled={true}
                          value={editedProfile.email}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Profile Type */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Profile Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="profileType"
                          value="person"
                          checked={editedProfile.type === "person"}
                          onChange={(e) =>
                            handleProfileUpdate("type", e.target.value)
                          }
                          className="text-blue-400 focus:ring-blue-400"
                        />
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Person</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="profileType"
                          value="company"
                          checked={editedProfile.type === "company"}
                          onChange={(e) =>
                            handleProfileUpdate("type", e.target.value)
                          }
                          className="text-purple-400 focus:ring-purple-400"
                        />
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="text-white">Company</span>
                      </label>
                    </div>
                  </div>

                  {/* Company Type (only if company) */}
                  {editedProfile.type === "company" && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Company Type
                      </label>
                      <select
                        value={editedProfile.companyType || ""}
                        onChange={(e) =>
                          handleProfileUpdate(
                            "companyType",
                            e.target.value as CompanyType
                          )
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="">Select company type</option>
                        {companyTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-gray-800"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Target MRR */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Target MRR ($)
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                      <input
                        type="number"
                        value={editedProfile.targetMrr}
                        onChange={(e) =>
                          handleProfileUpdate(
                            "targetMrr",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Current MRR */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Current MRR ($)
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                      <input
                        type="number"
                        value={editedProfile.currentMrr || 0}
                        onChange={(e) =>
                          handleProfileUpdate(
                            "currentMrr",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        disabled={editedProfile.autoCalculateMrr}
                      />
                    </div>
                  </div>

                  {/* Auto Calculate MRR */}
                  <div>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="autoCalculate"
                        checked={editedProfile.autoCalculateMrr || false}
                        onChange={(e) =>
                          handleProfileUpdate(
                            "autoCalculateMrr",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
                      />
                      <label
                        htmlFor="autoCalculate"
                        className="flex items-center space-x-1 text-white/80 text-sm cursor-pointer"
                      >
                        <span>Calculate automatically</span>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-white/60 hover:text-white/80 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Calculate MRR based on connected income sources
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Income Sources Section */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Income Sources
                  </h2>
                  <p className="text-white/60">
                    Connect to profiles that provide income to this profile.
                    Connections require approval from the source.
                  </p>
                </div>
              </div>

              {/* Add New Source */}
              <div className="mb-8">
                <ProfileSearch
                  currentProfileId={profile.id}
                  onConnect={handleSourceConnect}
                  excludeProfiles={sourceConnections.map(
                    (conn) => conn.sourceProfileId
                  )}
                  placeholder="Search for income sources to connect..."
                />
              </div>

              {/* Existing Sources */}
              <div className="space-y-4">
                {sourceConnections.length > 0 ? (
                  sourceConnections.map((connection) => (
                    <div
                      key={connection.id}
                      onClick={() => handleConnectionEdit(connection, "source")}
                      className="cursor-pointer"
                    >
                      <ConnectionCard
                        connection={connection}
                        currentProfileId={profile.id}
                        type="source"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                    <ArrowLeftIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Income Sources
                    </h3>
                    <p className="text-white/60 mb-4">
                      Start by connecting to profiles that provide income to
                      this profile.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Destinations Section */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Destinations
                  </h2>
                  <p className="text-white/60">
                    Connect to profiles where this profile sends income. These
                    connections are immediate.
                  </p>
                </div>
              </div>

              {/* Add New Destination */}
              <div className="mb-8">
                <ProfileSearch
                  currentProfileId={profile.id}
                  onConnect={handleDestinationConnect}
                  excludeProfiles={destinationConnections.map(
                    (conn) => conn.destinationProfileId
                  )}
                  placeholder="Search for destination profiles to connect..."
                />
              </div>

              {/* Existing Destinations */}
              <div className="space-y-4">
                {destinationConnections.length > 0 ? (
                  destinationConnections.map((connection) => (
                    <div
                      key={connection.id}
                      onClick={() =>
                        handleConnectionEdit(connection, "destination")
                      }
                      className="cursor-pointer"
                    >
                      <ConnectionCard
                        connection={connection}
                        currentProfileId={profile.id}
                        type="destination"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                    <ArrowRight className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Destinations
                    </h3>
                    <p className="text-white/60 mb-4">
                      Start by connecting to profiles where this profile sends
                      income.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Edit Modal */}
      {editingConnection && (
        <ConnectionEditModal
          connection={editingConnection.connection}
          isOpen={true}
          onClose={() => setEditingConnection(null)}
          onUpdate={(updates) => {
            updateConnection(editingConnection.connection.id, updates);
            setEditingConnection(null);
          }}
          onDelete={() => {
            deleteConnection(editingConnection.connection.id);
            setEditingConnection(null);
          }}
          profileName={editingConnection.profileName}
          type={editingConnection.type}
        />
      )}

      {/* Add Connection Modal */}
      {addingConnection && (
        <AddConnectionModal
          targetProfile={addingConnection.profile}
          isOpen={true}
          onClose={() => setAddingConnection(null)}
          onAdd={handleAddConnection}
          connectionType={addingConnection.type}
        />
      )}
    </div>
  );
}

export default EditProfile;