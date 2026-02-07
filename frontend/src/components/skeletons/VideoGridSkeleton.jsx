import React from "react";

const VideoGridSkeleton = () => {
  return (
    <div className="w-full px-4 py-6 md:p-6">
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        
        {[...Array(8)].map((_, index) => (
            
          <div key={index} className="animate-pulse">
            {/* Mobile: Horizontal skeleton | Desktop: Vertical skeleton */}
           
            <div className="flex md:flex-col gap-3 md:gap-0">
              {/* Thumbnail skeleton */}
              <div className="w-40 h-24 md:w-full md:h-0 md:pb-[56.25%] bg-gray-700 rounded-lg md:rounded-xl shrink-0" />

              {/* Content skeleton */}
              <div className="flex gap-2 md:gap-3 md:mt-3 flex-1">
                {/* Avatar skeleton - desktop only */}
                <div className="hidden md:block w-9 h-9 bg-gray-700 rounded-full shrink-0" />

                {/* Text skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>

                {/* Mobile avatar skeleton */}
                <div className="md:hidden w-8 h-8 bg-gray-700 rounded-full shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGridSkeleton;
