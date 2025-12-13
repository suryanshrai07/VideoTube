import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  const existedLike = await Like.findOneAndDelete({
    video: videoId,
    likedBy: user._id,
  });

  if (existedLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed from video"));
  }

  await Like.create({
    video: videoId,
    likedBy: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Video Liked Successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;

  const existedComment = await Like.findOneAndDelete({
    comment : commentId,
    likedBy : user._id
  });

  if(existedComment){
    return res.status(200).json(new ApiResponse(200,{},"Like removed from Comment"))
  }

  await Like.create({
    comment : commentId,
    likedBy : user._id
  })

  return res.status(201).json(new ApiResponse(201,{},"Liked comment successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const user = req.user;

  const existedTweet = await Like.findOneAndDelete({
    tweet : tweetId,
    likedBy : user._id
  });

  if(existedTweet){
    return res.status(200).json(new ApiResponse(200,{},"Like removed from Tweet"));
  }

  await Like.create({
    tweet : tweetId,
    likedBy : user._id
  })

  return res.status(201).json(new ApiResponse(201,{},"Tweet Liked Succesfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const user = req.user;

  const likedVideos = await Like.find({
    likedBy : user._id,
    video : {$exists : true, $ne : null}
  }).populate("video");

  const videos = likedVideos.map(like => like.video );

  return res
  .status(200)
  .json(new ApiResponse(200,videos,"Liked Videos fetched successfully"));

});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
