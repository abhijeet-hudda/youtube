import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen }) {
  // Common styling for links
  const baseLinkClass =
    "flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors";
  
  // Compact mode styling (center icons)
  const compactLinkClass = 
    "flex flex-col items-center justify-center gap-1 px-1 py-4 hover:bg-gray-100 rounded-lg";

  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-white overflow-y-auto pb-4 transition-all duration-200 border-r ${
        isOpen ? "w-64 px-3" : "w-20 px-1"
      }`}
    >
      <nav className="flex flex-col gap-1 py-3">
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${isOpen ? baseLinkClass : compactLinkClass} ${isActive ? "bg-gray-100 font-bold" : ""}`
          }
        >
          <span className="text-xl">🏠</span>
          <span className={`text-sm ${!isOpen && "text-[10px]"}`}>Home</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${isOpen ? baseLinkClass : compactLinkClass} ${isActive ? "bg-gray-100 font-bold" : ""}`
          }
        >
          <span className="text-xl">⚡</span>
          <span className={`text-sm ${!isOpen && "text-[10px]"}`}>Shorts</span>
        </NavLink>

        <NavLink
          to="/subscriptions"
          className={({ isActive }) =>
            `${isOpen ? baseLinkClass : compactLinkClass} ${isActive ? "bg-gray-100 font-bold" : ""}`
          }
        >
          <span className="text-xl">📺</span>
          <span className={`text-sm ${!isOpen && "text-[10px]"}`}>Subs</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${isOpen ? baseLinkClass : compactLinkClass} ${isActive ? "bg-gray-100 font-bold" : ""}`
          }
        >
          <span className="text-xl">📂</span>
          <span className={`text-sm ${!isOpen && "text-[10px]"}`}>You</span>
        </NavLink>

      </nav>

      {/* Show detailed lists only when expanded */}
      {isOpen && (
        <>
          <hr className="my-2 border-gray-200" />
          
          <div className="py-2">
            <h3 className="px-3 text-base font-semibold mb-2">Subscriptions</h3>
            {/* Mock Data */}
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <img src="https://i.pravatar.cc/32?img=5" className="w-6 h-6 rounded-full" alt="ch" />
              <span className="text-sm truncate">Chai aur Code</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <img src="https://i.pravatar.cc/32?img=8" className="w-6 h-6 rounded-full" alt="ch" />
              <span className="text-sm truncate">Hitesh Choudhary</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;