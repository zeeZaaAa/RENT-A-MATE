import { useState } from "react";
import SearchOverlay from "./searchBar";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsHeart } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";

import { Link } from "react-router-dom";

export default function RenterNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-md rounded-2xl px-4 sm:px-6 py-3 text-neutral-700 relative">
      <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
        {/* Left icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-transform hover:scale-110 md:hidden"
          >
            <RxHamburgerMenu size={22} />
          </button>

          {/* Like (hidden on mobile) */}
          <Link
            to="/renter/like"
            className="hidden md:flex p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-transform hover:scale-110"
          >
            <BsHeart size={20} />
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 mx-2 sm:mx-4">
          <SearchOverlay />
        </div>

        {/* Right icon */}
        <div className="flex items-center gap-2">
          <Link
            to="/renter/booking-transactions"
            className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-transform hover:scale-110"
          >
            <GrTransaction size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-2xl mt-2 p-4 flex flex-col gap-3 md:hidden z-50">
          <Link
            to="/renter/like"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            <BsHeart size={20} /> Like
          </Link>
          <Link
            to="/renter/booking-transactions"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition"
          >
            <GrTransaction size={20} /> Transactions
          </Link>
        </div>
      )}
    </nav>
  );
}
