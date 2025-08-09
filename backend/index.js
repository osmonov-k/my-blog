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
app.use(express.json());

app.use(clerkMiddleware());
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRouter);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.get("/test", (req, res) => {
//   res.status(200).send("It works!");
// });

// Test endpoint
app.get("/auth-state", requireAuth(), (req, res) => {
  try {
    const auth = getAuth(req);
    res.json({
      userId: auth.userId,
      sessionId: auth.sessionId,
      fullAuthState: req.auth,
    });
  } catch (error) {
    console.error("Auth state error:", error);
    res.status(401).json({ error: "Not authenticated" });
  }
});

// app.get("/protected", requireAuth(), async (req, res) => {
//   // Use `getAuth()` to get the user's `userId`
//   const { userId } = getAuth(req);

//   // Use Clerk's JavaScript Backend SDK to get the user's User object
//   const user = await clerkClient.users.getUser(userId);

//   return res.json({ user });
// });

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
