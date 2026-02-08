import React from "react";
import VideoCard from "./VideoCard";
import VideoGridSkeleton from "../skeletons/VideoGridSkeleton";
import videoEmptySvg from "../../assets/videos-empty.svg";

export default function VideoGrid({ videos, loading = true }) {
  // Loading skeleton
  if (loading) {
    return <VideoGridSkeleton />;
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <img src={videoEmptySvg} alt="Videos-Not-Found" />
        <p className="text-lg font-medium">No videos available</p>
        <div className="flex flex-col w-72 text-center">
          <p className="text-sm mt-1">
            There are no videos here available.Please try to search some thing
            else.
          </p>
        </div>
      </div>
    );
  }

  // Video grid
  return (
    <div className="w-full   px-4 py-6 md:p-6  ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8 gap-4 md:gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
