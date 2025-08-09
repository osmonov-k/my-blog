import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sortQuery") || "newest";
  const currentCategory = searchParams.get("cat") || "all";

  const handleFilterChange = (value) => {
    if (currentSort !== value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sortQuery: value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    if (currentCategory !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "trending", label: "Trending" },
    { value: "oldest", label: "Oldest" },
  ];

  const categories = [
    { value: "", label: "All Posts" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "devops", label: "DevOps & Cloud" },
    { value: "database", label: "Database" },
    { value: "marketing", label: "Marketing" },
  ];

  return (
    <div className="w-64 fixed right-8 top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Sorting Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Sort By
        </h2>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={currentSort === option.value}
                onChange={() => handleFilterChange(option.value)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Categories
        </h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`text-sm cursor-pointer transition-colors ${
                currentCategory === category.value
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {category.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
