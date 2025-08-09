// models/post.model.js
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { createClerkClient } from "@clerk/clerk-sdk-node"; // Correct import for v5+

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clerkUserId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "general",
    },
    desc: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visit: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 },
    },
    isAdminPost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware with correct Clerk v5+ syntax
postSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const user = await clerkClient.users.getUser(this.clerkUserId);
      this.isAdminPost = user.publicMetadata?.role === "admin";

      if (!this.isAdminPost) {
        this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error("Clerk API error:", error);
      this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  }
  next();
});

export default mongoose.model("Post", postSchema);
