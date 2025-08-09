import React from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
const PostListItem = ({ post }) => {
  return (
    <Link
      to={`/${post.slug}`}
      className="block w-full h-full min-h-[341px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Image (top) - Fixed height */}
      {post.img && (
        <div className="h-[221px] w-full overflow-hidden">
          <Image
            path={post.img}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            w="393"
          />
        </div>
      )}

      {/* Content (bottom) - Dark blue hover effect */}
      <div className="h-[120px] p-4 flex flex-col bg-white group-hover:bg-blue-800 transition-colors duration-300">
        {/* Category and Date row */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-xs group-hover:text-white transition-colors">
            {post.category}
          </span>
          <span className="text-gray-500 text-xs group-hover:text-gray-300 transition-colors">
            {format(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-3 group-hover:text-white transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  );
};

export default PostListItem;
