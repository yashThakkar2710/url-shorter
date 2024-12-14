import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // to accept the data which comes from form and in json formet
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to accept the data which come from url
// app.use(express.static("public")) // this is used when we want to store any image

app.use(cookieParser()); // to performe crud on the user cookie

import userRouter from "./routes/user.routes.js";
import { urlrouter } from "./routes/url.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/url", urlrouter);

export { app };
