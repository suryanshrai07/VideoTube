import React, { useState } from "react";
import {
  formatViews,
  formatTimeAgo,
  formatDuration,
} from "../utilities/formatter";
import thumbnailSvg from "../assets/thumbnail-logo.svg";

export default function VideoCard({ video }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    thumbnail,
    title = "Untitled Video",
    views = 0,
    createdAt,
    duration,
    ownerDetails = {},
  } = video;

  const { username = "Unknown", avatar } = ownerDetails;

  const handleVideoClick = () => {
    console.log("Video clicked:", _id);
  };

  return (
    <div onClick={handleVideoClick} className="cursor-pointer group">
      {/* Add transform-gpu and will-change-auto to prevent scroll jank */}
      <div className="flex flex-col gap-3 md:gap-0 transform-gpu will-change-auto">
        {/* Thumbnail Section */}
        <div className="relative bg-gray-800 rounded-lg md:rounded-xl overflow-hidden shrink-0 w-full aspect-video">
          {/* Inner container to isolate the transform */}
          <div className="absolute inset-0">
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse" />
            )}

            {/* Thumbnail Image */}
            {!imageError ? (
              <img
                src={thumbnail}
                alt={title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`
                  w-full h-full object-cover 
                  transition-transform duration-300 
                  group-hover:scale-105
                  ${imageLoaded ? "opacity-100" : "opacity-0"}
                `}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              />
            ) : (
              // Fallback for broken images
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <img src={thumbnailSvg} alt="thumbnail" />
              </div>
            )}
          </div>

          {/* Duration Badge (bottom-right corner) */}
          {duration && (
            <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 md:px-2 md:py-1 rounded z-10">
              {formatDuration(parseInt(duration))}
            </div>
          )}
        </div>

        {/* Video Meta Section - Add transform-gpu here too */}
        <div className="flex gap-2 md:gap-3 md:mt-3 transform-gpu">
          {/* Channel Avatar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Mobile Avatar - Shown on mobile only */}
          <div className="md:hidden shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-white font-medium text-sm md:text-sm leading-tight line-clamp-2 mb-1 group-hover:text-gray-200 transition-colors">
              {title}
            </h3>

            <p className="text-gray-400 text-xs mb-0.5 md:mb-1">{username}</p>

            <div className="flex items-center text-gray-400 text-xs">
              <span>{formatViews(parseInt(views))} Views</span>
              <span className="mx-1">•</span>
              <span>{formatTimeAgo(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
