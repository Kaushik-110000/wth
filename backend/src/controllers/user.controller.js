import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import mongoose from "mongoose";

const generateAccessandRefreshTokens = async (userId) => {
  console.log("hello");
  try {
    console.log("user id is ", userId);
    const user = await User.findById(userId);
    console.log("now user is ", user.userName);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating the Tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //user detail based n model -> validation on backend (not empty , format) -> check already exist (username,email) -> check images ->check avatar -> upload image to cloudinary and get returned url -> successfully uploaded or not -> create user object -> create entry on DB -> remove password and refresh token field in output  -> check user creation -> return response / error

  const {
    userName,
    fullName,
    email,
    password,
    linkedin,
    googleScholar,
    designation,
  } = req.body;
  console.log(userName, email);

  console.log(req);

  if (
    [userName, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    throw new ApiError(409, "User already exists");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Kindly, reupload the avatar image");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    designation: designation || "Respected",
    password,
    googleScholar: googleScholar || null,
    linkedin: linkedin || null,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password, userName } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "Either username or email is required");
  }

  const theUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  console.log(theUser);

  if (!theUser) {
    throw new ApiError(405, "User does not exists");
  }

  const passCheck = await theUser.isPasswordCorrect(password);

  if (!passCheck) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    theUser._id
  );

  const loggedInUser = await User.findById(theUser._id).select(" -password ");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 230 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  console.log(incomingRefreshToken);
  console.log(req.cookies);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(403, "Invalid refresh token");
    }

    console.log(user);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or invalid");
    } else {
      const options = {
        httpOnly: true,
        secure: true,
      };

      const { accessToken, refreshToken } =
        await generateAccessandRefreshTokens(user._id);

      res.cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 230 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", accessToken, options);
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken },
            "Access Token refreshed successfully"
          )
        );
    }
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user found successfully"));
});

const checkRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  if (incomingRefreshToken) return res.status(200).json(200);
  else return res.status(201).json(201);
});

export {
  registerUser,
  loginUser,
  logOutUser,
  getAccessToken,
  getCurrentUser,
  checkRefreshToken,
};
