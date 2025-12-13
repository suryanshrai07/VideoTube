import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const user = req.user;

  const { content } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ message: "tweet body can not be empty" });

  const tweet = await Tweet.create({
    owner: user._id,
    content: content.trim(),
  });

  if (!tweet)
    return res
      .status(500)
      .json({ message: "Internal server error while creating Tweet" });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created sucessfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "Invalid user Id" });

  const userTweets = await Tweet.find({
    owner: user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User tweet fetched Sucessfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Tweet body cannot be empty" });
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).json({ message: "Tweet not found" });
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Unauthorized to update this tweet" });
  }

  tweet.content = content.trim();
  const updatedTweet = await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const user = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return res.status(404).json({ message: "Tweet not found" });
  }

  if (tweet.owner.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete this tweet" });
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
