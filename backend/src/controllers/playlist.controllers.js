import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import {Video} from "../models/video.models.js"

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const user = req.user;

  if (!name?.trim() || !description?.trim())
    return res
      .status(400)
      .json({ message: "Name and description can not be empty" });

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: user._id,
  });

  if (!playlist)
    return res.status(500).json({ message: "Error while creating playlist" });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "playlist created sucessfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userPlaylists = await Playlist.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylists, "User playlist fetched sucessfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }

  const playlist = await Playlist.findById(playlistId).populate("videos");

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this playlist" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched sucessfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(400).json({ message: "Invalid playlist or video ID" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to modify this playlist" });
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (playlist.videos.includes(videoId)) {
    return res.status(400).json({ message: "Video already exists in playlist" });
  }

  playlist.videos.push(videoId);
  await playlist.save();

  return res.status(200).json(
    new ApiResponse(200, playlist, "Video added to playlist successfully")
  );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(400).json({ message: "Invalid playlist or video ID" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to modify this playlist" });
  }

  if (!playlist.videos.includes(videoId)) {
    return res.status(400).json({ message: "Video not found in playlist" });
  }

  playlist.videos = playlist.videos.filter(
    (id) => id.toString() !== videoId
  );

  await playlist.save();

  return res.status(200).json(
    new ApiResponse(200, playlist, "Video removed from playlist successfully")
  );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to delete this playlist" });
  }

  await playlist.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Playlist deleted successfully")
  );

});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }

  if (!name?.trim() && !description?.trim()) {
    return res.status(400).json({
      message: "At least one field (name or description) is required to update",
    });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this playlist",
    });
  }

  if (name?.trim()) {
    playlist.name = name.trim();
  }

  if (description?.trim()) {
    playlist.description = description.trim();
  }

  await playlist.save();

  return res.status(200).json(
    new ApiResponse(200, playlist, "Playlist updated successfully")
  );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
