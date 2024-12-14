import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`server is renning at PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      "error at the catch part in index while connected to db",
      error
    );
  });

// const app = express();

// app.get("/", (req, res) => {
//   res.send("server is working");
// });

// app.get("/api/login", (req, res) => {
//   const arr = [
//     {
//       id: "1",
//       name: "yash",
//       surname: "Thakkar",
//     },
//     {
//       id: "2",
//       name: "abc",
//       surname: "xyz",
//     },
//   ];
//   res.send(arr);
// });
// const PORT = 4000;

// app.listen(PORT, (req, res) => {
//   console.log(`server is listing on http://localhost:${PORT}`);
// });
