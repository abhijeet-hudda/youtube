import Container from "../container/Container";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="fixed top-14 left-0 w-56 h-[calc(100vh-56px)] bg-white border-r">
      <Container>
        <div className="flex items-center gap-3 py-4">
          <button className="text-xl">☰</button>
          <span className="text-lg font-bold text-red-600">YouTube</span>
        </div>

        <hr />
        <nav className="flex flex-col gap-1 py-2">
          <NavLink
            to="/" // check this part 
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
             Home
          </NavLink>

          <NavLink
            to="/subscriptions" //check this part 
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Subscriptions
          </NavLink>
        </nav>

        <hr />

        <div className="py-3">
          <p className="px-4 text-sm font-semibold text-gray-600 mb-2">
            SUBSCRIPTIONS
          </p>

          <ul className="space-y-2">
            <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <img
                src="https://i.pravatar.cc/32?img=1"
                alt="channel"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">Code With Alex</span>
            </li>

            <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <img
                src="https://i.pravatar.cc/32?img=2"
                alt="channel"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">JS Mastery</span>
            </li>
          </ul>
        </div>

        <hr />

        <div className="flex flex-col gap-1 py-2">
          <NavLink
            to="/history" //check this part
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
             History
          </NavLink>

          <NavLink
            to="/playlists" // check this part 
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Playlists
          </NavLink>
        </div>
      </Container>
    </aside>
  );
}

export default Sidebar;
