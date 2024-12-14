import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { Url } from "../models/url.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { nanoid } from "nanoid";

const saveUrl = asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    throw new ApiError(400, "All the fields are required");
  }

  try {
    // Generate a 6-character unique shortId
    const short_Url = nanoid(6);
    console.log("Generated shortId:", short_Url);

    // Check if the original URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "URL already exists"));
    }

    // Assume `req.user` contains the logged-in user's ID (set by the `verifyJWT` middleware)
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "User not authorized"));
    }

    // Create a new URL record
    const newUrl = await Url.create({
      originalUrl,
      shortId: short_Url,
      user: userId, // Store the user's ObjectId as a reference
    });

    res
      .status(201)
      .json(new ApiResponse(201, newUrl, "URL registered successfully"));
  } catch (error) {
    console.error("Error during URL registration:", error);
    throw new ApiError(500, "Something went wrong while registering the URL");
  }
});
const getShortUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  try {
    // Fetch URL by shortId and populate the user details
    const urlRecord = await Url.findOne({ shortId }).populate("user");
    if (!urlRecord) {
      return res.status(404).json(new ApiResponse(404, null, "URL not found"));
    }

    // Increment the click count
    urlRecord.clicks += 1;
    await urlRecord.save();

    // Include the updated click count in the response
    res
      .status(200)
      .json(new ApiResponse(200, urlRecord, "URL fetched successfully"));
  } catch (error) {
    console.error("Error fetching URL with user:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

const getUrlInfo = asyncHandler(async (req, res) => {
  const { shortId } = req.params; // Extract shortId from the route parameters

  try {
    // Find the URL record by shortId
    const urlRecord = await Url.findOne({ shortId }).populate("user");
    if (!urlRecord) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    // Send the details including click count
    res.status(200).json({
      originalUrl: urlRecord.originalUrl,
      shortId: urlRecord.shortId,
      clicks: urlRecord.clicks,
      createdAt: urlRecord.createdAt,
      updatedAt: urlRecord.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching URL info:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const updateUrl = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Get `userId` from route parameters.
  const { shortId, originalUrl } = req.body; // Data to update.

  if (!_id) {
    return res.status(400).json({
      statusCode: 400,
      data: null,
      message: "userId is required.",
      success: false,
    });
  }

  if (!shortId || !originalUrl) {
    return res.status(400).json({
      statusCode: 400,
      data: null,
      message: "shortUrl and longUrl are required.",
      success: false,
    });
  }

  try {
    // Find and update the URL belonging to the user.
    const updatedUrl = await Url.findOneAndUpdate(
      { user: _id, shortId },
      { originalUrl },
      { new: true } // Return the updated document.
    );

    if (!updatedUrl) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: "URL not found for this user.",
        success: false,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: updatedUrl,
      message: "URL updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: "An error occurred while updating the URL.",
      success: false,
    });
  }
});

const getUserUrls = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Get `userId` from route parameters.

  if (!_id) {
    return res.status(400).json({
      statusCode: 400,
      data: null,
      message: "userId is required.",
      success: false,
    });
  }

  try {
    // Find all URLs associated with the user.
    const urls = await Url.find({ user: _id });

    if (!urls.length) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: "No URLs found for this user.",
        success: false,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: urls,
      message: "URLs fetched successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: "An error occurred while fetching URLs.",
      success: false,
    });
  }
});
export { saveUrl, getShortUrl, getUrlInfo, updateUrl, getUserUrls };
