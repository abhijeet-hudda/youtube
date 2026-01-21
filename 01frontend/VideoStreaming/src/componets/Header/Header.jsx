import { useState } from "react";
import Container from "../container/Container";

function Header() {
    const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-gray-700 border-b z-50">
      <Container>
        <nav className="flex items-center justify-between h-14">
          <div className="">
            <Link to="/" className="text-xl font-bold text-red-600">
              YouTube
            </Link>
          </div>
          <div className="flex flex-1 px-6 justify-center">
            <div className="flex w-full max-w-xl">
              <input
                type="text"
                placeholder="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none"
              />
              <button className="px-4 border border-l-0 border-gray-500 rounded-r-full bg-gray-300">
                🔍
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <Link
              to="/upload"
              className="px-4 py-1 border rounded-full hover:bg-gray-100"
            >
              ➕ Create
            </Link>
            <div className="relative">
              <img
                //image dalni h 
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                  <Link
                    //yha profile ki link dalni h 
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    //yha channel ki link dalni h 
                    to="/channel"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Channel
                  </Link>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
export default Header
