import "dotenv/config";
import express from "express";
import "./services/usersCleanup.js";
import connectDB from "./lib/connectDb.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";

import cors from "cors";

import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

const app = express();
app.use(cors(process.env.CLIENT_URL));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my blog API!" });
});

app.use(clerkMiddleware());
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRouter);

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000!");
});
