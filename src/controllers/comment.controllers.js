import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const user = req.user;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Comment can't be empty"));
  }

  const newComment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "commented succesfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "comment can not be empty" });
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: content.trim(),
    },
    {
      new: true,
    }
  );

  if (!comment)
    return res.status(404).json({ message: "This comment no longer exist" });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (deletedComment) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted succesfully"));
  }

  return res.status(400).json({
    message: "Invalid comment Id",
  });
});

export { getVideoComments, addComment, updateComment, deleteComment };
