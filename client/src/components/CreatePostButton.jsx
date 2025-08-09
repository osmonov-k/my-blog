import { Link } from "react-router-dom";

const CreatePostButton = () => {
  return (
    <Link
      to="/write"
      className="hidden md:block    cursor-pointer"
      aria-label="Create new post"
    >
      <button
        className="
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white font-medium
          px-6 py-3
          rounded-lg
          text-base
          shadow-md hover:shadow-lg
          transition-all duration-200
          flex items-center gap-2
          hover:scale-[1.02]
          active:scale-95
       
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 5v14M5 12h14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        New Post
      </button>
    </Link>
  );
};

export default CreatePostButton;
