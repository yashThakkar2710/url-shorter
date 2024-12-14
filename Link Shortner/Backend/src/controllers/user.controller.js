import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessandRefreshTokens = async (useId) => {
  try {
    const user = await User.findById(useId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong will genrating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from the frounted
  // check the validations - empty
  // check the user already exists : username,email
  // create user object and - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // retrun response

  const { userName, email, password } = req.body;
  console.log("Request body:", req.body);
  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All the fileds are required ");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName already exists");
  }

  const sanitizedUserName = userName.toLowerCase();
  const user = await User.create({
    userName: sanitizedUserName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // in this we will pass the value which we dont want
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong will registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registed Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req->body
  // userName or password
  //find user
  //password check
  // access and refresh token
  // send cookie

  const { email, userName, password } = req.body;

  if (!(email || userName)) {
    throw new ApiError(400, "userName or email requred");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user Does Not exists");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(404, "Please enter the correct Password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const opetions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, opetions)
    .cookie("refreshToken", refreshToken, opetions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In SuccessFully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookie
  // reset refeshToken

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const opetions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", opetions)
    .clearCookie("refreshToken", opetions)
    .json(new ApiResponse(200, {}, "user Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: req.user,
  });
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
