import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/features/authFeatures/auth.Thunks"; // Adjust path
import Container from "../container/Container";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get Auth State from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  //console.log("user",user);
  const handleLogout = () => {
    dispatch(logoutUser());
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 px-4">
      <div className="flex items-center justify-between h-full">
        {/* === LEFT: Hamburger & Logo === */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            {/* Hamburger Icon SVG */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-1">
            {/* YouTube Icon SVG (Simple Red Box) */}
            <div className="text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                id="Youtube--Streamline-Flex"
                height="25"
                width="25"
              >
                <desc>Youtube Streamline Icon: https://streamlinehq.com</desc>
                <g id="youtube--youtube-clip-social-video">
                  <path
                    id="Intersect"
                    fill="#ffffff"
                    d="M6.78363 9.25983c1.22409 -0.65573 2.81158 -1.62796 2.81158 -2.2599s-1.58749 -1.60416 -2.81158 -2.2599c-0.64249 -0.34418 -1.39304 0.1321 -1.39304 0.86096l0 2.79788c0 0.72887 0.75055 1.20514 1.39304 0.86096Z"
                    stroke-width="1"
                  ></path>
                  <path
                    id="Subtract"
                    fill="#d7e0ff"
                    fill-rule="evenodd"
                    d="M3.93973 11.7809c-1.43908 -0.1308 -2.63271 -1.2618 -2.80066 -2.69699C1.05928 8.40203 1 7.70645 1 7.00003c0 -0.70642 0.05928 -1.40201 0.13907 -2.08388 0.16795 -1.43523 1.36158 -2.56617 2.80066 -2.69697C4.93631 2.1286 5.95848 2.05249 7 2.05249c1.04152 0 2.06369 0.07611 3.0603 0.16669 1.4391 0.1308 2.6327 1.26174 2.8006 2.69697 0.0798 0.68187 0.1391 1.37746 0.1391 2.08388 0 0.70642 -0.0593 1.402 -0.1391 2.08388 -0.1679 1.43519 -1.3615 2.56619 -2.8006 2.69699 -0.99661 0.0906 -2.01878 0.1667 -3.0603 0.1667 -1.04152 0 -2.06369 -0.0761 -3.06027 -0.1667ZM9.595 7.00004c0 0.63194 -1.58749 1.60417 -2.81159 2.2599 -0.64248 0.34418 -1.39304 -0.13209 -1.39304 -0.86096V5.6011c0 -0.72887 0.75056 -1.20514 1.39304 -0.86096C8.00751 5.39587 9.595 6.3681 9.595 7.00004Z"
                    clip-rule="evenodd"
                    stroke-width="1"
                  ></path>
                  <path
                    id="Intersect_2"
                    stroke="#4147d5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M1.13907 9.08391c0.16795 1.43519 1.36158 2.56619 2.80066 2.69699 0.99658 0.0906 2.01875 0.1667 3.06027 0.1667 1.04152 0 2.06369 -0.0761 3.0603 -0.1667 1.4391 -0.1308 2.6327 -1.2618 2.8006 -2.69699 0.0798 -0.68188 0.1391 -1.37746 0.1391 -2.08388 0 -0.70642 -0.0593 -1.40201 -0.1391 -2.08388 -0.1679 -1.43523 -1.3615 -2.56617 -2.8006 -2.69697C9.06369 2.1286 8.04152 2.05249 7 2.05249c-1.04152 0 -2.06369 0.07611 -3.06027 0.16669 -1.43908 0.1308 -2.63271 1.26174 -2.80066 2.69697C1.05928 5.59802 1 6.29361 1 7.00003c0 0.70642 0.05928 1.402 0.13907 2.08388Z"
                    stroke-width="1"
                  ></path>
                  <path
                    id="Intersect_3"
                    stroke="#4147d5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.78363 9.25983c1.22409 -0.65573 2.81158 -1.62796 2.81158 -2.2599s-1.58749 -1.60416 -2.81158 -2.2599c-0.64249 -0.34418 -1.39304 0.1321 -1.39304 0.86096l0 2.79788c0 0.72887 0.75055 1.20514 1.39304 0.86096Z"
                    stroke-width="1"
                  ></path>
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tighter hidden sm:block">
              StreamVideo
            </span>
          </Link>
        </div>

        {/* === CENTER: Search === */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl ml-10">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:border-blue-500 focus:outline-none shadow-inner"
            />
            <button className="px-5 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 hover:bg-gray-200">
              🔍
            </button>
          </div>
        </div>

        {/* === RIGHT: Auth Buttons === */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /* LOGGED IN VIEW */
            <>
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full"
              >
                ➕ <span className="text-sm font-medium">Create</span>
              </Link>

              <div className="relative">
                <img
                  src={user?.user?.avatar || "https://i.pravatar.cc/40"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full cursor-pointer object-cover"
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                {showDropdown && (
                  <div className="absolute right-0 top-10 w-60 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold">
                        {user?.user?.fullname || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.user?.email || "@username"}
                      </p>
                    </div>

                    <Link
                      to={`/channel/${user?.user?.username}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Your Channel
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* GUEST VIEW */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-blue-600 border border-gray-200 rounded-full hover:bg-blue-50 hover:border-transparent text-sm font-semibold flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-gray-400 rounded-full overflow-hidden">
                  <svg
                    className="w-full h-full text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden sm:block px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
