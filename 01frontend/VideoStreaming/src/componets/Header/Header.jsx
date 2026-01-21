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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link to="/" className="flex items-center gap-1">
            {/* YouTube Icon SVG (Simple Red Box) */}
            <div className="text-red-600">
               <svg height="24" viewBox="0 0 24 24" width="24" focusable="false" style={{fill: "currentColor"}}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
            </div>
            <span className="text-xl font-bold tracking-tighter hidden sm:block">YouTube</span>
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
              <Link to="/upload" className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full">
                 ➕ <span className="text-sm font-medium">Create</span>
              </Link>
              
              <div className="relative">
                <img
                  src={user?.avatar || "https://i.pravatar.cc/40"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full cursor-pointer object-cover"
                  onClick={() => setShowDropdown(!showDropdown)}
                />

                {showDropdown && (
                  <div className="absolute right-0 top-10 w-60 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold">{user?.fullName || "User"}</p>
                        <p className="text-xs text-gray-500">{user?.email || "@username"}</p>
                    </div>
                    
                    <Link to={`/channel/${user?.username}`} className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      Your Channel
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">
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
                    <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
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

export default Header 