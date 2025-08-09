import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;

      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/posts?search=${query}`);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#888"
        viewBox="0 0 24 24"
        style={{ transform: "scaleX(-1)" }}
      >
        <path d="M10 2a8 8 0 1 1-5.293 14.293l-4.707 4.707L2.707 22l4.707-4.707A8 8 0 0 1 10 2m0 2a6 6 0 1 0 4.243 10.243A6 6 0 0 0 10 4z" />
      </svg>

      <input
        type="text"
        placeholder="Search a post..."
        className="bg-transparent"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;
