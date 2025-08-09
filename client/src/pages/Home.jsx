import React from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Home = () => {
  return (
    <main className="container mx-auto px-4">
      <FeaturedPosts />
      <PostList />
    </main>
  );
};

export default Home;
