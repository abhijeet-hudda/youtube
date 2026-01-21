import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./componets/Header/Header";
import Sidebar from "./componets/Header/Sidebar";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-14">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className={`flex-1 bg-gray-50 overflow-y-auto transition-all duration-200 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;