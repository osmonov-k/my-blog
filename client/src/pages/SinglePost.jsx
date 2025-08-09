import React from "react";
import Image from "./../components/Image";
import { Link, useParams } from "react-router-dom";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePost = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading post: {error.message}
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-12 text-gray-500">Post not found</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Meta info */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>{format(data.createdAt)}</span>
        <span>•</span>
        <Link
          to={`/posts?cat=${data.category}`}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {data.category}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
        {data.title}
      </h1>

      {/* Featured Image */}
      {data.img && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            path={data.img}
            className="w-full h-auto max-h-[500px] object-cover"
            w="1200"
            alt="Featured post image"
          />
        </div>
      )}

      {/* Author and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {data?.user?.img && (
            <Image
              src={data.user.img}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
              w="40"
              h="40"
              alt="Author profile"
            />
          )}
          <Link
            to={`/posts?author=${data?.user?.username}`}
            className=" hover:text-blue-800 hover:underline font-medium transition-colors"
          >
            By{" "}
            <span className="text-blue-600 hover:text-blue-800">
              {data?.user?.username}
            </span>
          </Link>
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            className="text-gray-500 hover:text-[#1DA1F2] transition-colors"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-[#333] transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-[#0077B5] transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>

      {/* Post Actions */}
      <div className="mb-8">
        <PostMenuActions post={data} />
      </div>

      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed mb-8">{data.desc}</p>

      {/* Content */}
      <div className="prose max-w-none text-gray-700 mb-8">
        {data.content ? (
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        ) : (
          <p className="text-gray-500 italic">
            No content available for this post.
          </p>
        )}
      </div>

      {/* Tags */}
      {data.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {data.tags.map((tag) => (
            <Link
              key={tag}
              to={`/posts?tag=${tag}`}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors cursor-pointer"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePost;
