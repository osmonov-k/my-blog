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

const allowed = new Set(
  (process.env.CLIENT_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    // normalize (no trailing slash)
    .map((u) => u.replace(/\/+$/, ""))
);

const corsMiddleware = cors({
  origin: (origin, cb) => {
    // Non-browser clients (curl/Postman) have no Origin → allow
    if (!origin) return cb(null, true);

    // Normalize incoming origin (strip trailing slash)
    const clean = origin.replace(/\/+$/, "");
    if (allowed.has(clean)) return cb(null, true);

    // Optional: allow any subdomain of a base domain
    // if (clean.endsWith(".blog.kanatosmon.com")) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true, // needed if you use cookies or auth headers across origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Use exactly once, before your routes:
app.use(corsMiddleware);

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).send("ok"));

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
