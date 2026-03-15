import { useState } from "react";
import { useSelector } from "react-redux";
import { formatViews, formatTimeAgo } from "../utilities/formatter";
import { useLocation } from "react-router-dom";
import likeSVG from "../assets/likeButton.svg";
import dislikeSVG from "../assets/dislike.svg";
const MOCK_COMMENTS = [
  {
    id: 1,
    user: "Phoenix Baker",
    handle: "@phoenix",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=phoenix",
    text: "Looks absolutely clean! 🔥",
    time: "just now",
    likes: 12,
  },
  {
    id: 2,
    user: "Lana Steiner",
    handle: "@lana",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=lana",
    text: "Really enjoyed this one, keep it up!",
    time: "2 mins ago",
    likes: 5,
  },
  {
    id: 3,
    user: "Drew Cano",
    handle: "@drew",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=drew",
    text: "Subscribed immediately. Quality content.",
    time: "15 mins ago",
    likes: 23,
  },
];

export default function VideoPlayer() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const video = location.state?.video;

  

  const {
    videoFile,
    thumbnail,
    title,
    description,
    views,
    createdAt,
    ownerDetails,
  } = video;

  
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(2);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      setDisliked(false);
    }
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: "You",
        handle: "@you",
        avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=you",
        text: commentText.trim(),
        time: "just now",
        likes: 0,
      },
      ...comments,
    ]);
    setCommentText("");
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 mt-2 ">
      {/* ── VIDEO ── */}
      <div className="w-full bg-black ">
        <video
          src={videoFile}
          poster={thumbnail}
          controls
          className="w-full max-h-[75vh] block"
        />
      </div>

      {/* ── INFO ── */}
      <div className="w-full bg-zinc-900 px-4 py-4 border-b border-white/5">
        {/* title + meta */}
        <h1 className="text-base font-semibold text-zinc-50 leading-snug mb-1">
          {title}
        </h1>
        <p className="text-xs text-zinc-500 mb-4">
          {formatViews(views)} views &nbsp;·&nbsp; {formatTimeAgo(createdAt)}
        </p>

        {/* like / dislike / save row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            {/* like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${
                  liked
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
            >
              <img src={likeSVG} alt="Like" className="w-4 h-4" />
              {likeCount}
            </button>

            {/* dislike */}
            <button
              onClick={() => {
                setDisliked(!disliked);
                if (!disliked) setLiked(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${
                  disliked
                    ? "bg-white/15 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
            >
              <img src={dislikeSVG} alt="Dislike" className="w-4 h-4" />
            </button>
          </div>

          {/* save */}
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
              ${
                saved
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
              }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            {saved ? "Saved" : "Save"}
          </button>
        </div>

        {/* owner row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ownerDetails.avatar}
              alt={ownerDetails.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-100">
                {ownerDetails.username}
              </p>
              <p className="text-xs text-zinc-500">@{ownerDetails.username}</p>
            </div>
          </div>

          {user?.username !== ownerDetails.username && (
            <button
              onClick={() => setFollowed(!followed)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${
                followed
                  ? "bg-white/8 border border-white/10 text-zinc-400"
                  : "bg-violet-600 hover:bg-violet-500 text-white"
              }`}
            >
              {followed ? (
                "Following"
              ) : (
                <>
                  <span className="text-lg leading-none">+</span> Follow
                </>
              )}
            </button>
          )}
        </div>

        {/* description */}
        {description && (
          <div className="mt-4 bg-white/3 border border-white/5 rounded-xl px-3.5 py-3">
            <p
              className={`text-sm text-zinc-400 leading-relaxed overflow-hidden transition-all duration-300 ${descExpanded ? "max-h-96" : "max-h-10"}`}
            >
              {description}
            </p>
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              className="mt-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              {descExpanded ? "Show less ▲" : "Show more ▼"}
            </button>
          </div>
        )}
      </div>

      {/* ── COMMENTS ── */}
      <div className="w-full bg-zinc-950 px-4 py-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-zinc-200">Comments</h2>
          <span className="text-xs font-bold bg-violet-500/15 text-violet-400 rounded-full px-2 py-0.5">
            {comments.length}
          </span>
        </div>

        {/* input */}
        <div className="flex gap-3 items-start mb-6">
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitComment();
              }
            }}
            placeholder="Add a comment…"
            className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-3
              text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none
              focus:border-violet-500/50 transition-colors"
          />
          <button
            onClick={submitComment}
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Post
          </button>
        </div>

        {/* list */}
        <div className="flex flex-col divide-y divide-white/5">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 py-4 first:pt-0">
              <img
                src={c.avatar}
                alt={c.user}
                className="w-9 h-9 rounded-full object-cover border border-white/8 shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-zinc-200">
                    {c.user}
                  </span>
                  <span className="text-xs text-zinc-600">{c.time}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                  {c.text}
                </p>
                <button className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-violet-400 transition-colors">
                  <img src={likeSVG} alt="like" />
                  {c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
