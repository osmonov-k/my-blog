import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 }, // TTL index for auto-deletion
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
