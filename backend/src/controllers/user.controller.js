import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  // const { userId } = getAuth(req);
  const userId = req.userId;

  // const user = await User.findByIdAndUpdate({ clerkId: userId }, req.body, {
  //   new: true,
  // });
  const user = await User.findOneAndUpdate(
    { clerkId: userId }, // filter by Clerk ID
    req.body,
    { new: true } // return updated document
  );

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

// export const syncUser = asyncHandler(async (req, res) => {
//   const { userId } = getAuth(req);
//   console.log("Decoded Clerk userId:", userId);
//   console.log("Incoming header:", req.headers.authorization);

//   const existingUser = await User.findOne({ clerkId: userId });
//   if (existingUser) {
//     return res
//       .status(200)
//       .json({ user: existingUser, message: "User already exists" });
//   }

//   const clerkUser = await clerkClient.users.getUser(userId);

//   const userData = {
//     clerkId: userId,
//     email: clerkUser.emailAddresses[0].emailAddress,
//     firstName: clerkUser.firstName || "",
//     lastName: clerkUser.lastName || "",
//     username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
//     profilePicture: clerkUser.imageUrl || "",
//   };

//   const user = await User.create(userData);
//   console.log("Incoming auth header:", req.headers.authorization);

//   res.status(201).json({ user, message: "User created successfully" });
// });

// export const syncUser = asyncHandler(async (req, res) => {
//   console.log("➡️ Entered syncUser controller with userId:", req.userId);

//   // const { userId } = getAuth(req);
//   const userId = req.userId;

//   console.log("Decoded Clerk userId:", userId);
//   console.log("Incoming header:", req.headers.authorization);

//   const existingUser = await User.findOne({ clerkId: userId });
//   if (existingUser) {
//     console.log("Returning existing user:", existingUser._id.toString());
//     return res.status(200).json({
//       user: existingUser,
//       message: "User already exists",
//     });
//   }

//   const clerkUser = await clerkClient.users.getUser(userId);

//   const userData = {
//     clerkId: userId,
//     email: clerkUser.emailAddresses[0].emailAddress,
//     firstName: clerkUser.firstName || "",
//     lastName: clerkUser.lastName || "",
//     username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
//     profilePicture: clerkUser.imageUrl || "",
//   };

//   const user = await User.create(userData);

//   console.log("Returning new user:", user._id.toString());
//   return res.status(201).json({
//     user,
//     message: "User created successfully",
//   });
// });

export const syncUser = asyncHandler(async (req, res) => {
  console.log("➡️ Entered syncUser controller");

  const userId = req.userId; // set in protectRoute
  console.log("✅ Decoded Clerk userId:", userId);

  if (!userId) {
    console.log("❌ No userId found in req.userId");
    return res.status(401).json({ message: "Unauthorized - no userId" });
  }

  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    console.log("✅ Returning existing user:", existingUser._id.toString());
    return res.status(200).json({
      user: existingUser,
      message: "User already exists",
    });
  }

  // If new user, fetch from Clerk
  console.log("📡 Fetching Clerk user:", userId);
  const clerkUser = await clerkClient.users.getUser(userId);

  console.log("✅ Clerk user fetched:", clerkUser.id);

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
    profilePicture: clerkUser.imageUrl || "",
  };

  console.log("📝 Creating new user with:", userData);
  const user = await User.create(userData);

  console.log("✅ New user created:", user._id.toString());
  return res.status(201).json({
    user,
    message: "User created successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  // const { userId } = getAuth(req);
  const userId = req.userId;
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  // const { userId } = getAuth(req);
  const userId = req.userId;
  // const { userId } = req.auth;
  const { targetUserId } = req.params;

  if (userId === targetUserId)
    return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser)
    return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully",
  });
});
