import { RxHamburgerMenu } from "react-icons/rx";
import { BsChatQuote } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import { TbBrandBooking } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function MateNav() {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm shadow-md rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 md:gap-6 text-neutral-700 transition-all hover:shadow-lg">

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-500 transition-transform hover:scale-125 cursor-pointer">
          <RxHamburgerMenu size={20} />
        </div>
        <Link
          to="/mate/chat-list"
          className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-500 transition-transform hover:scale-125 cursor-pointer"
        >
          <BsChatQuote size={20} />
        </Link>
      </div>

      <p className="text-base sm:text-lg font-semibold text-center flex-1">Mate</p>

      <div className="flex items-center gap-2">
        <Link
          to="/mate/renting-request"
          className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-500 transition-transform hover:scale-125 flex items-center justify-center"
        >
          <TbBrandBooking size={20} />
        </Link>

        <Link
          to="/mate/booking-transactions"
          className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-500 transition-transform hover:scale-125 flex items-center justify-center"
        >
          <GrTransaction size={20} />
        </Link>
      </div>
    </div>
  );
}
