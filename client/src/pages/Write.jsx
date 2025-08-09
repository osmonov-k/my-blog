import "react-quill-new/dist/quill.snow.css";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [progress, setProgress] = useState(0);
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src='${img.url}'/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src='${video.url}'/></p>`
      );
  }, [video]);

  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, []);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.data.slug}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Please login to create a post
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <Upload type="image" setProgress={setProgress} setData={setCover}>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {cover ? "Change Cover Image" : "Upload Cover Image"}
              </button>
            </Upload>
            {cover && (
              <div className="mt-2">
                <img
                  src={cover.url}
                  alt="Cover preview"
                  className="h-48 w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xl font-medium"
              placeholder="My Awesome Story"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops-cloud">DevOps & Cloud</option>
              <option value="database">Database</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows={3}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="A brief summary of your post..."
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-2">
                <Upload type="image" setData={setImg} setProgress={setProgress}>
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="Insert image"
                  >
                    🖼️ Image
                  </button>
                </Upload>
                <Upload
                  type="video"
                  setData={setVideo}
                  setProgress={setProgress}
                >
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="Insert video"
                  >
                    ▶️ Video
                  </button>
                </Upload>
              </div>
              <ReactQuill
                value={value}
                onChange={setValue}
                theme="snow"
                className="flex-1 border border-gray-300 rounded-lg shadow-sm"
                readOnly={0 < progress && progress < 100}
                placeholder="Write your post content here..."
              />
            </div>
          </div>

          {/* Progress and Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {progress > 0 && progress < 100 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Uploading: {progress}%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={mutation.isPending || (0 < progress && progress < 100)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? "Publishing..." : "Publish Post"}
            </button>
          </div>

          {mutation.isError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {mutation.error.response?.data?.message ||
                mutation.error.message ||
                "Failed to publish post"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Write;
