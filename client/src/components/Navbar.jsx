import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "./Image";
import Search from "./Search";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const categoriesButtonRef = useRef(null);
  const categoriesMenuRef = useRef(null);
  let hoverTimeout = useRef(null);

  // Categories data
  const categories = [
    { name: "All Posts", path: "posts" },
    { name: "Frontend", path: "posts?cat=frontend" },
    { name: "Backend", path: "posts?cat=backend" },
    { name: "DevOps", path: "posts?cat=devops" },
    { name: "Database", path: "posts?cat=database" },
    { name: "Marketing", path: "posts?cat=marketing" },
  ];

  // Handle categories hover
  const handleCategoriesEnter = () => {
    clearTimeout(hoverTimeout.current);
    setShowCategories(true);
  };

  const handleCategoriesLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowCategories(false);
    }, 300); // 300ms delay before closing
  };

  // Close menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        event.target !== menuButtonRef.current &&
        !categoriesButtonRef.current?.contains(event.target) &&
        !categoriesMenuRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
        setShowCategories(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      clearTimeout(hoverTimeout.current);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Image
              path="/blog-assets/logo-ko.png"
              alt="logo"
              w={32}
              h={32}
              className="rounded-lg"
            />
            <span className="ml-2 text-lg font-semibold">
              Kanat Osmonov Blog
            </span>
          </Link>

          {/* Desktop Navigation - Shows at 1030px and up */}
          <div className="hidden min-[1030px]:flex items-center gap-6">
            <Search />

            <SignedIn>
              <Link
                to="/write"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Create Post
              </Link>
            </SignedIn>

            <div
              className="relative"
              ref={categoriesButtonRef}
              onMouseEnter={handleCategoriesEnter}
              onMouseLeave={handleCategoriesLeave}
            >
              <button
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setShowCategories(!showCategories)}
              >
                Categories
              </button>
              <div
                ref={categoriesMenuRef}
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 ${
                  showCategories ? "visible" : "invisible"
                }`}
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
              >
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="block px-4 py-2 hover:bg-gray-50"
                    onClick={() => setShowCategories(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <SignedOut>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu button - Shows below 1030px */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-[1030px]:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu - Shows below 1030px */}
        {mobileMenuOpen && (
          <div className="min-[1030px]:hidden fixed inset-0 z-40">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <div
              ref={mobileMenuRef}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <Search className="mb-4" />

                <SignedIn>
                  <Link
                    to="/write"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Create Post
                  </Link>
                </SignedIn>

                <div className="py-2">
                  <h4 className="px-4 py-2 font-medium">Categories:</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <SignedOut>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center p-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
