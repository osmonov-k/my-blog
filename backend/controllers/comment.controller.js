import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.json(comments);
};
export const addComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const user = await User.findOne({ clerkUserId });

  const newComment = new Comment({
    ...req.body,
    user: user._id,
    icon: user.img,
    post: req.params.postId,
  });

  const savedComment = await newComment.save();

  setTimeout(() => {
    res.status(201).json(savedComment);
  }, 3000);
};

export const deleteComment = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const commentId = req.params.id;

    // 1. Get role from session claims
    const isAdmin = req.auth.sessionClaims?.metadata?.role === "admin";

    // 2. Admin can delete any comment
    if (isAdmin) {
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json("Comment deleted by admin");
    }

    // 3. Regular users need to be verified
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json("User not found");

    // 4. Users can only delete their own comments
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      user: user._id,
    });

    if (!deletedComment) {
      return res.status(403).json("You can only delete your own comments");
    }

    res.status(200).json("Comment deleted");
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json("Internal server error");
  }
};
