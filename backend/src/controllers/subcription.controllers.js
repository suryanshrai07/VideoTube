import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  const subscriberId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid channel ID"));
  }

  if (subscriberId.toString() === channelId.toString()) {
    return res.status(400).json({
      success: false,
      message: "you can't subscribe to your own channel",
    });
  }

  const existedSubscriber = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  // If already subscribed
  if (existedSubscriber) {
    await Subscription.deleteOne({
      subscriber: subscriberId,
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribed: false },
          "channel unsubscribed successfully"
        )
      );
  }

  // If not Subscribed
  await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribed: true },
        "Channel Subscribed Successfully"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel Id" });
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "fullName username avatar"
  );

  const subscriberCount = subscribers.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        { subscriberCount, subscribers },
        "Subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    return res.status(400).json({ message: "Invalid subscriber Id" });
  }

  const userSubscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "fullName username avatar _id")
    .lean();

  const subscribedChannels = userSubscribedChannels.map((sub) => sub.channel);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribedChannels },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
