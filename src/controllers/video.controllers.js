import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  //TODO: get all videos based on query, sort, pagination

  // Build match stage (filters)
  let match = {};

  if (userId) {
    match.owner = userId;
  }

  if (query) {
    match.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Only return published videos publicly
  match.isPublished = true;

  // Sorting stage
  const sortStage = {};
  sortStage[sortBy] = sortType === "asc" ? 1 : -1;

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [{ $project: { username: 1, avatar: 1 } }],
      },
    },

    { $unwind: "$ownerDetails" },

    { $sort: sortStage },
  ];

  // Pagination options
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res.status(200).json(new ApiResponse(true, "Videos fetched successfully", videos));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if ([title, description].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json({message : "Title and Description are required"});
  }

  // console.log("Files received:", req.files);
  const videoFile = req.files?.videoFile?.[0].path;
  const thumbnailFile = req.files?.thumbnail?.[0].path;

  // console.log("Video File Path:", videoFile);
  // console.log("Thumbnail File Path:", thumbnailFile);
  if (!videoFile || !thumbnailFile) {
    return res
      .status(400)
      .json({ message: "Video file and Thumbnail are required" });
  }

  const uploadedVideo = await uploadOnCloudinary(videoFile);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile);

  // console.log("Uploaded Video:", uploadedVideo);
  // console.log("Uploaded Thumbnail:", uploadedThumbnail);

  if (!uploadedVideo?.secure_url || !uploadedThumbnail?.secure_url) {
    return res
      .status(500)
      .json({ message: "Error uploading files to Cloudinary" });
  }

  const newVideo = await Video.create({
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumbnail.secure_url,
    title,
    description,
    duration: Math.ceil(uploadedVideo.duration || 0), // in seconds
    owner: req.user._id,
  });

  return res.status(201).json(new ApiResponse(true, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  const video = await Video.findById(videoId).populate(
    "owner",
    "username _id fullName"
  );

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  return res.status(200).json(new ApiResponse(true, "Video fetched successfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  const thumbnailFile = req.file?.path;

  const updateData = {};

  if (title && title.trim() !== "") {
    updateData.title = title;
  }

  if (description && description.trim() !== "") {
    updateData.description = description;
  }

  if (thumbnailFile && thumbnailFile.trim() !== "") {
    const uploadThumbnail = await uploadOnCloudinary(thumbnailFile);

    if (!uploadThumbnail?.secure_url) {
      return res
        .status(500)
        .json({ message: "Error uploading thumbnail to Cloudinary" });
    }
    updateData.thumbnail = uploadThumbnail.secure_url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: updateData,
    },
    {
      new: true,
    }
  );

  if (!updatedVideo) {
    return res.status(500).json({ message: "Error updating video" });
  }

  return res.status(200).json(new ApiResponse(true, "Video updated successfully", updatedVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const deletedVideo = await Video.findByIdAndDelete(videoId);

  // console.log(deletedVideo)

  if (!deletedVideo) {
    return res
      .status(404)
      .json({ message: "Video not found or already deleted" });
  }

  return res.status(200).json(new ApiResponse(true, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  await Video.findByIdAndUpdate(videoId, [
    {
      $set: {
        isPublished: { $not: "$isPublished" },
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(true, "Video publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
