import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
      return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  const isAdmin = (user?.publicMetadata?.role === "admin") | false;
  const isSaved = savedPosts?.data?.some((p) => p === post._id) || false;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const queryClinet = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        { postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: ["savedPosts"] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        { postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleFeature = () => {
    featureMutation.mutate();
  };
  const handleSave = () => {
    if (!user) {
      return navigate("/login");
    }
    saveMutation.mutate();
  };

  return (
    <div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Saved post fetching failed"
      ) : (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill={
              saveMutation.isPending
                ? isSaved
                  ? "none"
                  : "black"
                : isSaved
                ? "black"
                : "none"
            }
            stroke="currentColor" // Uses text color by default
            strokeWidth="1.5" // Makes the border clearly visible
            viewBox="0 0 24 24"
          >
            <path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2H6z" />
          </svg>
          <span>Save this Post</span>

          {saveMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}

      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleFeature}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={
              featureMutation.isPending
                ? post.isFeatured
                  ? "none"
                  : "black"
                : post.isFeatured
                ? "black"
                : "none"
            }
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Feature This Post</span>
          {featureMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}

      {user && (post?.user?.username === user?.username || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="black"
            viewBox="0 0 24 24"
          >
            <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2zM9 4V3h6v1h5v2H4V4h5z" />
          </svg>

          <span>Delete this Post</span>
          {deleteMutation.isPending && (
            <span className="text-xs">in progress</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;
