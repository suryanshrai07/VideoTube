import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVideos } from "../features/videos/videoActions";
import { incrementPage, resetVideos } from "../features/videos/videoSlice";
import VideoCard from "./VideoCard";
import VideoGridSkeleton from "./skeletons/VideoGridSkeleton";
import videoEmptySvg from "../assets/videos-empty.svg";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function VideoGrid({ query = "" }) {
  const dispatch = useDispatch();
  const { videos, page, hasMore, loading } = useSelector(
    (state) => state.videos,
  );

  useEffect(() => {
    dispatch(resetVideos());
    dispatch(fetchVideos(1, query));
  }, [query]);

  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchVideos(page, query));
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) dispatch(incrementPage());
  }, [loading, hasMore]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  // Loading skeleton
  if (loading && videos?.length === 0) {
    return <VideoGridSkeleton />;
  }

  // Empty state
  if (!loading && videos?.length === 0) {
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
    <div className="w-full px-4 py-6 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8 gap-4 md:gap-6">
        {videos?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading spinner for next page */}
      {loading && videos.length > 0 && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* End of results */}
      {!hasMore && videos?.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-6">No more videos</p>
      )}
    </div>
  );
}
