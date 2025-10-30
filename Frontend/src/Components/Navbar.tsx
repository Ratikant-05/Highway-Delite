import React from "react";
import logo from "../assets/logo.png"; // replace with your actual logo path

interface NavbarProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange, searchValue = "" }) => {
  return (
    <nav className="w-full bg-white shadow-sm py-4 md:py-6 px-4 md:px-6 sticky top-0 z-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-2">
        <img src={logo} alt="Highway Delite" className="h-12 w-auto" />
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Search experiences"
            className="px-4 py-2 rounded-md border border-gray-300 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          <button
            type="button"
            onClick={() => onSearchChange?.(searchValue)}
            className="shrink-0 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-md transition"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
