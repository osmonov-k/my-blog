// Comments.jsx
import React from "react";
import Comment from "./Comment";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`
  );
  return res.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post comment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation.mutate({ desc: formData.get("desc") });
    e.target.reset();
  };

  return (
    <section className="mt-12 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Discussion ({data?.length || 0})
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3 items-start">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt="Your profile"
              className="w-10 h-10 rounded-full object-cover mt-1"
            />
          )}
          <div className="flex-1">
            <textarea
              name="desc"
              placeholder="What are your thoughts?"
              className="w-full p-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
              rows="3"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {isPending ? (
          <div className="text-center py-4 text-gray-500">
            Loading comments...
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Error loading comments
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <>
            {mutation.isPending && (
              <Comment
                comment={{
                  desc: mutation.variables.desc,
                  createdAt: new Date(),
                  user: { img: user?.imageUrl, username: user?.username },
                }}
                isPending={true}
              />
            )}
            {data?.map((comment) => (
              <Comment key={comment._id} comment={comment} postId={postId} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Comments;
