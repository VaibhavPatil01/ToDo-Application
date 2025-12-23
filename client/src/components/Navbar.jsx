import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, logout } = useContext(AppContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
            <span className="ml-4 text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
