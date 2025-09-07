import { FaBell, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MateNotification() {
  // mock notifications
  const notifications = [
    { id: 1, title: "New Message", message: "You have a new message from Zee." },
    { id: 2, title: "Booking Request", message: "Lily sent a booking request." },
    { id: 3, title: "Profile Viewed", message: "Max viewed your profile." },
  ];

  return (
    <div className="bg-emerald-50 min-h-screen p-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <FaBell />
            Notifications
          </h1>

          {/* Home button */}
          <Link
            to="/mate"
            className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow hover:bg-emerald-100 text-emerald-700 transition"
          >
            <FaHome />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <p className="font-semibold text-emerald-700">{notif.title}</p>
                <p className="text-gray-600 text-sm">{notif.message}</p>
              </div>
              <div className="text-gray-400 text-xs mt-2 sm:mt-0">Just now</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
