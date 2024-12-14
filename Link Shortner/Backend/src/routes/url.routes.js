import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  saveUrl,
  getShortUrl,
  getUrlInfo,
  getUserUrls,
  updateUrl,
} from "../controllers/url.controller.js";

const urlrouter = Router();

urlrouter.route("/saveurl").post(verifyJWT, saveUrl);
urlrouter.route("/:shortId").get(verifyJWT, getShortUrl);
urlrouter.route("/info/:shortId").get(verifyJWT, getUrlInfo);
urlrouter.route("/update-url/:_id").put(verifyJWT, updateUrl);
urlrouter.route("/user-urls/:_id").get(verifyJWT, getUserUrls);
// urlrouter.route("/update").put(verifyJWT, updateUrl);

export { urlrouter };
