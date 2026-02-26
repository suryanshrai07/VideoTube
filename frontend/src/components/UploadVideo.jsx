import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../utilities/axios";

export default function UploadVideo({ onClose }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) setVideoFile(file);
  };

  const handleSubmit = async () => {
    if (!videoFile || !thumbnail || !title.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const res = await axiosInstance.post("/videos", formData);
      // console.log(res);
      toast.success("Video Uploaded Successfully");

      setVideoFile(null);
      setDescription("");
      setThumbnail(null);
      setTitle("");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message);
      toast.error("Error while uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-2xl bg-[#0d0d0d] md:rounded-xl border-0 md:border md:border-white/10 overflow-y-auto ">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-[#0d0d0d] z-10">
          <h2 className="text-white font-semibold text-base">Upload Video</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-5">
          {/* Drag & Drop Video Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => videoInputRef.current.click()}
            className={`w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center py-10 gap-3
              ${dragging ? "border-purple-500 bg-purple-500/10" : "border-white/15 bg-white/3 hover:border-white/30"}`}
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Upload className="w-7 h-7 text-purple-400" />
            </div>
            {videoFile ? (
              <p className="text-sm text-purple-300 font-medium px-4 text-center">
                {videoFile.name}
              </p>
            ) : (
              <>
                <p className="text-sm text-white font-medium">
                  Drag and drop video files to upload
                </p>
                <p className="text-xs text-gray-500">
                  Your videos will be private until you publish them.
                </p>
                <button
                  type="button"
                  className="mt-1 px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Select Files
                </button>
              </>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">
              Thumbnail <span className="text-purple-400">*</span>
            </label>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/10 bg-white/3">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current.click()}
                className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                Choose File
              </button>
              <span className="text-xs text-gray-500 truncate">
                {thumbnail ? thumbnail.name : "No file selected"}
              </span>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">
              Title <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full px-3 py-2.5 rounded-lg bg-white/3 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">
              Description <span className="text-purple-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-white/3 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </div>
    </div>
  );
}
