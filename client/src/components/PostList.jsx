import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PostListItem from "./PostListItem";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};
const PostList = () => {
  const [searchParams] = useSearchParams();
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["posts", searchParams.toString()],
      queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
    });

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  if (status === "loading")
    return <div className="py-8 text-center">Loading posts...</div>;
  if (status === "error")
    return (
      <div className="py-8 text-center text-red-500">
        Error loading posts: {error.message}
      </div>
    );
  if (allPosts.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-100">
        Latest Articles
      </h2>
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="py-4 text-center text-gray-500">
            Loading more posts...
          </div>
        }
        endMessage={
          <p className="py-4 text-center text-gray-500">
            You've reached the end
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {allPosts.map((post) => (
            <div key={post._id} className="w-full">
              <PostListItem post={post} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default PostList;
