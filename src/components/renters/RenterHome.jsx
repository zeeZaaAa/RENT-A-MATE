import RenterNav from "./RenterNav";
import ChatList from "../chat/ChatList";
import { logout } from "../../script/logout.js";

export default function RenterHome() {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 text-blue-900">
      {/* Navbar */}
      <RenterNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 lg:px-16 py-6 w-full">
        <div className="flex justify-between items-center w-full max-w-6xl mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
            Renter
          </h1>
        </div>

        {/* Chat List */}
        <div className="w-full max-w-6xl flex-1">
          <ChatList />
        </div>

        {/* Logout Button: above footer, aligned left */}
        <div className="w-full mt-6 flex justify-start px-4 md:px-8 lg:px-16">
          <button
            onClick={logout}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-3 mt-6">
        © 2025 Rent a Mate
      </footer>
    </div>
  );
}
