// Comment.jsx
import React from "react";
import Image from "./Image";
import { format } from "timeago.js";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ comment, postId, isPending = false }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment removed");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });

  return (
    <div className={`flex gap-3 ${isPending ? "opacity-70" : ""}`}>
      <div className="flex-shrink-0">
        <Image
          src={comment?.user?.img}
          className="w-10 h-10 rounded-full object-cover"
          w="40"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-900">
            {comment?.user?.username}
          </span>
          <span className="text-xs text-gray-500">
            {format(comment.createdAt)}
          </span>

          {user &&
            (comment?.user?.username === user?.username ||
              role === "admin") && (
              <button
                onClick={() => mutation.mutate()}
                className="text-xs text-red-500 hover:text-red-700 ml-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </button>
            )}
        </div>

        <p className="mt-1 text-gray-700 whitespace-pre-wrap">
          {comment.desc}
          {isPending && <span className="text-gray-400"> (sending)</span>}
        </p>
      </div>
    </div>
  );
};

export default Comment;
