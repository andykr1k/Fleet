import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

    const navigation = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/jobs", name: "Jobs" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="relative z-[10] max-w-7xl mx-auto pt-8 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link to={"/"} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
        <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex space-x-6">
          {navigation.map((item) =>
            location.pathname !== item.path ? (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-white transition"
              >
                {item.name}
              </Link>
            ) : null
          )}
        </nav>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-500"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <Link
                to="/account"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
              >
                Account
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}