import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
