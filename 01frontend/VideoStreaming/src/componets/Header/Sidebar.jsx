import React, {useState,useEffect} from "react";
import { NavLink,Link} from "react-router-dom";
import { useSubscribedChannels } from "../../queries/subscription.queries";
import {useSelector,useDispatch} from 'react-redux';
import SubscriptionCard from "./SubscriptionCard";
import { fetchCurrentUser } from "../../store/features/authFeatures/auth.Thunks";

function Sidebar({ isOpen }) {
   const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  // useEffect(()=>{
  //   dispatch(fetchCurrentUser());
  // },[dispatch,user])
  const subscriberId = user?._id || user?.user?._id ||user?.user?.user?._id;
  //console.log("user", user);
  //console.log("subscriberId", subscriberId);
  const { data} =  useSubscribedChannels(subscriberId);
  const [isYouOpen, setIsYouOpen] = useState(true);
  //console.log("subscribed channels data", data.data);
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

        {/* <NavLink
          to="/subscriptions"
          className={({ isActive }) =>
            `${isOpen ? baseLinkClass : compactLinkClass} ${isActive ? "bg-gray-100 font-bold" : ""}`
          }
        >
          <span className="text-xl">📺</span>
          <span className={`text-sm ${!isOpen && "text-[10px]"}`}>Subs</span>
        </NavLink> */}

        <div className="flex flex-col">
          <div
            onClick={() => {
              // If sidebar is closed, maybe navigate to history or expand sidebar
              if (!isOpen) return; 
              setIsYouOpen(!isYouOpen);
            }}
            className={`${
              isOpen ? baseLinkClass : compactLinkClass
            } cursor-pointer hover:bg-gray-100 justify-between group`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl">📂</span>
              <span className={`text-sm ${!isOpen && "text-[10px]"}`}>You</span>
            </div>
            {/* Show arrow only when sidebar is open */}
            {isOpen && (
              <span className="text-xs text-gray-500">
                {isYouOpen ? "▲" : "▼"}
              </span>
            )}
          </div>

          {/* Sub-menu: Only show if Sidebar is Open AND "You" is toggled on */}
          {isOpen && isYouOpen && (
            <div className="flex flex-col mt-1 ml-4 border-l-2 border-gray-200 pl-2 space-y-1">
              
              {/* 1. History Link */}
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-gray-200 transition-colors ${
                    isActive ? "bg-gray-200 font-bold" : "text-gray-700"
                  }`
                }
              >
                <span>⏳</span> {/* Or use <History size={18} /> */}
                <span>History</span>
              </NavLink>

              {/* 2. Playlists Link */}
              <NavLink to="/user-playlists" 
                  className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-gray-200 transition-colors ${
                        isActive ? "bg-gray-200 font-bold" : "text-gray-700"
                      }`
                    }
                  >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-5 h-5" // Tailwind size classes
                  >
                    <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h12v2H3v-2zm13 0v5l6-3-6-3z" />
                  </svg>
                  
                  <span>Playlists</span>
              </NavLink>
              
            </div>
          )}
        </div>

      </nav>

      {/*Show detailed lists only when expanded*/}
      {isOpen && (
        <>
          <hr className="my-2 border-gray-200" />
          
          <div className="py-2">
            <h3 className="px-3 text-base font-semibold mb-2">Subscriptions</h3>
            {/*Data*/}
            {data?.data?.map((subs) =>(
              <Link to={`/${subs?.username}`} key={subs?._id}>
                <div  className="w-full">
                <SubscriptionCard subsObject={subs} />
              </div>
              </Link>
            ))}
           
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;