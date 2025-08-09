import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "./PostListItem";

const fetchFeaturedPosts = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=12&sort=newest`
  );
  return res.data;
};

const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchFeaturedPosts,
  });

  if (isPending)
    return <div className="py-8 text-center">Loading featured posts...</div>;
  if (error)
    return (
      <div className="py-8 text-center text-red-500">
        Error loading featured posts
      </div>
    );

  const posts = data.posts || [];
  if (posts.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-100">
        Featured Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedPosts;
