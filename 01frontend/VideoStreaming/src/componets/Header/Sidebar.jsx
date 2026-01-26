import React, { Suspense } from "react";
import { NavLink,Link} from "react-router-dom";
import { useSubscribedChannels } from "../../queries/subscription.queries";
import {useSelector} from 'react-redux';
import SubscriptionCard from "./SubscriptionCard";

function Sidebar({ isOpen }) {

  const user = useSelector((state) => state.auth);
  const subscriberId = user?.user?.user?._id||user?.user_id||user?._id;
  //console.log("user", user);
  //console.log("subscriberId", subscriberId);
  const { data} =  useSubscribedChannels(subscriberId);
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