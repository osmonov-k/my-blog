import ImageKit from "imagekit";
import postModel from "../models/post.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const query = {};

    const { cat, author, searchQuery, sortQuery, featured } = req.query;

    if (cat) query.category = cat;
    if (searchQuery) query.title = { $regex: searchQuery, $options: "i" };
    if (featured) query.isFeatured = true;

    if (author) {
      const user = await User.findOne({ username: author }).select("_id");
      if (!user) return res.status(404).json("No post found");
      query.user = user._id;
    }

    let sortObj = { createdAt: -1 };

    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "popular":
          sortObj = { visit: -1 };
          break;
        case "trending":
          sortObj = { visit: 1 };
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = true;
    }
    console.log("Sort Object:", sortObj);
    const posts = await Post.find(query)
      .populate("user", "username")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit);

    const totalPosts = await Post.countDocuments(query);
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json("Internal server error");
  }
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug }); // Changed to let

    let counter = 2;
    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({
      // Changed to Post (assuming that's your model name)
      user: user._id,
      clerkUserId, // MUST INCLUDE THIS
      img: user.img,
      slug,
      ...req.body,
    });

    const post = await newPost.save();
    res.status(201).json(post); // Changed to 201 for resource creation
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json("Internal server error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted");
    }

    // Find the user making the request
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    // First find the post to verify ownership
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }

    // Verify the post belongs to the user
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).json("You can only delete your own posts!");
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json("Post has been deleted");
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json("Internal server error");
  }
};

export const featurePost = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json("You cannot feature posts");
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json("Post not found!");

    const isFeatured = post.isFeatured;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !isFeatured },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Feature post error:", error);
    res.status(500).json("Internal server error");
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});
export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};
