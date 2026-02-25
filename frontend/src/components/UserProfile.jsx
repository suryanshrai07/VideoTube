import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import editSvg from "../assets/editButton.svg";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utilities/axios";
import { Loader } from "lucide-react";

const tabs = ["Videos", "Playlist", "Tweets", "Following"];
const filters = ["Previously uploaded", "Oldest", "Item"];

export default function UserProfile({ videos }) {
  const { username } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/c/${username}`);
        // console.log(data.data);
        setUserProfile(data.data);
      } catch (error) {
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      getUserProfile();
    }
  }, [username]);

  const [activeTab, setActiveTab] = useState("Videos");
  const [activeFilter, setActiveFilter] = useState("Previously uploaded");

  if (loading && !userProfile) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!loading && !userProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black gap-2">
        <p className="text-6xl font-black text-white/80 tracking-tighter">
          404
        </p>
        <p className="text-lg font-semibold text-white">User not found</p>
        <p className="text-sm text-gray-500">
          This account doesn't exist or has been removed.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-xs text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4 cursor-pointer"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black text-white overflow-y-auto">
      {/* coverImage */}

      {userProfile.coverImage ? (
        <div className="w-full h-36 md:h-44">
          <img
            src={userProfile.coverImage}
            alt="CoverImage"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-full h-36 md:h-44"
          style={{
            background:
              "linear-gradient(135deg, #0f0c29 0%, #c471ed 40%, #f64f59 65%, #f8a84b 85%, #89d4e0 100%)",
          }}
        />
      )}

      {/* ── Profile Info ── */}
      <div className="px-6 pb-4 border-b border-white/10">
        {/* Row 1: Avatar only — overlaps banner */}
        <div className="flex items-end justify-between -mt-14">
          <div className="shrink-0">
            <img
              src={userProfile.avatar}
              alt={`${userProfile.username}`}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-black ring-2 ring-white/20"
            />
          </div>

          {/* Edit button stays top-right */}
          {user?.username === userProfile.username && (
            <button className="flex items-center gap-1.5 mb-1 px-4 py-1.5 text-sm font-medium rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <img src={editSvg} />
              Edit
            </button>
          )}
        </div>

        {/* Row 2: Name & details — fully below banner */}
        <div className="mt-3 mb-4">
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            {userProfile.fullName}
          </h2>
          <p className="text-sm text-gray-400">@{userProfile.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {userProfile.subscriberCount} Subscribers&nbsp;
            <span className="text-gray-600">•</span>&nbsp;{" "}
            {userProfile.channelsSubscribedToCount} Subscribed
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-6 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-purple-400 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex gap-2 px-6 py-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeFilter === f
                ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/15"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Video Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 pb-8">
        {videos.map((video) => (
          <div key={video.id} className="group cursor-pointer">
            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
              <img
                src={video.thumb}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-black ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-2">
              <p className="text-sm font-medium leading-snug line-clamp-2 text-white group-hover:text-purple-300 transition-colors">
                {video.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {video.views}&nbsp;•&nbsp;{video.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
