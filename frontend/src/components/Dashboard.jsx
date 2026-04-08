import { useState, useEffect, useCallback } from "react";
import {
  UserIcon,
  EyeIcon,
  HeartIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { incrementPage, resetVideos } from "../features/videos/videoSlice";
import { fetchVideos } from "../features/videos/videoActions";
import UploadVideo from "./UploadVideo";

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-violet-600" : "bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#141416] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30"
      style={{ animationDelay: delay }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { videos, page, hasMore, loading } = useSelector(
    (state) => state.videos,
  );

  const [rows, setRows] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    setRows(videos);
  }, [videos]);

  // Initial load
  useEffect(() => {
    dispatch(resetVideos());
    dispatch(fetchVideos(1, "", user._id));
  }, [user._id]);

  // Load next pages
  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchVideos(page, "", user._id));
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) dispatch(incrementPage());
  }, [loading, hasMore]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const toggleActive = (id) => {
    setRows((prev) =>
      prev.map((v) =>
        v._id === id ? { ...v, isPublished: !v.isPublished } : v,
      ),
    );
  };

  const deleteRow = (id) => setRows((prev) => prev.filter((v) => v._id !== id));

  return (
    <div className="min-h-screen w-full bg-[#0d0d0f] font-sans text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 translate-y-1/2 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                {user.fullName}
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Track, manage and forecast your content and orders.
            </p>
          </div>

          <button
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-500/40 active:scale-95"
            onClick={() => setShowUpload(true)}
          >
            <PlusIcon size={16} />
            Upload Video
          </button>
        </div>
        {showUpload && <UploadVideo onClose={() => setShowUpload(false)} />}

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            icon={<EyeIcon size={20} />}
            label="Total Views"
            value="0"
            delay="0ms"
          />
          <StatCard
            icon={<UserIcon size={20} />}
            label="Total Followers"
            value="0"
            delay="80ms"
          />
          <StatCard
            icon={<HeartIcon size={20} />}
            label="Total Likes"
            value="0"
            delay="160ms"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#141416]">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07] bg-[#1c1c20]">
                  {[
                    "Toggle",
                    "Status",
                    "Video",
                    "Rating",
                    "Date Uploaded",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-500 first:pl-5 last:pr-5 last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((video, i) => (
                  <tr
                    key={video._id}
                    className="group border-b border-white/5 transition-colors duration-150 last:border-0 hover:bg-white/[0.025]"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <td className="py-4 pl-5 pr-3">
                      <Toggle
                        checked={video.isPublished}
                        onChange={() => toggleActive(video._id)}
                      />
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          video.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                            : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                        />
                        <span className="line-clamp-2 max-w-xs text-sm font-medium text-gray-200 lg:max-w-md xl:max-w-lg">
                          {video.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xs font-medium text-emerald-400">
                          {video.likes} likes
                        </span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs font-medium text-red-400">
                          {video.dislikes} dislikes
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-gray-500">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 pl-3 pr-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <button
                          onClick={() => deleteRow(video._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <TrashIcon size={14} />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-violet-500/10 hover:text-violet-400">
                          <PencilIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/5 md:hidden">
            {rows.map((video) => (
              <div key={video._id} className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-gray-100">
                      {video.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          video.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                            : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Unpublished"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-emerald-400">
                        {video.likes} likes
                      </span>
                      <span className="text-xs text-red-400">
                        {video.dislikes} dislikes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Toggle
                    checked={video.isPublished}
                    onChange={() => toggleActive(video._id)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteRow(video._id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <TrashIcon size={14} />
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-violet-500/10 hover:text-violet-400">
                      <PencilIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <p className="py-6 text-center text-sm text-gray-500">Loading...</p>
          )}

          {!hasMore && rows.length > 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              No more videos
            </p>
          )}

          {!loading && rows.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-500">
              No videos found
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-700">
          {rows.length} video{rows.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
