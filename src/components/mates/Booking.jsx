import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { format } from "date-fns";
import { FaHome } from "react-icons/fa";
import { RxCheck } from "react-icons/rx"; 
import { Link } from "react-router-dom";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [endingIds, setEndingIds] = useState([]);
  const [toast, setToast] = useState(null); 
  const pageSize = 10;

  const fetchBookings = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/booking/mate?page=${pageNum}&pageSize=${pageSize}`
      );
      setBookings(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("Failed to fetch bookings: " + message);
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const handleEnd = async (id) => {
    if (!confirm("Are you sure you want to end this booking?")) return;
    try {
      setEndingIds((prev) => [...prev, id]);
      const res = await api.post(`/api/booking/end/${id}`);
      setToast({ message: res.data.message, visible: true });
      setTimeout(() => setToast(null), 3000);
      fetchBookings(page);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("End booking failed: " + message);
      console.error("End booking failed:", err);
    } finally {
      setEndingIds((prev) => prev.filter((eId) => eId !== id));
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      paid: "text-emerald-800",
      confirmed: "text-yellow-500",
      end: "text-green-600",
      refunded: "text-red-600",
      reviewed: "text-purple-600",
    };
    return map[status] || "text-gray-700";
  };

  return (
    <div className="p-4 md:p-8 bg-emerald-50 min-h-screen relative">
      <Link
        to="/mate"
        className="absolute top-4 left-4 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition"
      >
        <FaHome size={20} />
      </Link>

      <div className="flex justify-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">
          My Bookings
        </h1>
      </div>

      {toast && toast.visible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white border border-emerald-400 shadow-lg rounded-lg px-6 py-4 flex items-center space-x-3 animate-fade-in-out z-50">
          <RxCheck className="text-emerald-600 text-2xl animate-bounce" />
          <span className="text-emerald-800 font-medium">{toast.message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center text-emerald-700 py-10">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-emerald-700 py-10">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white text-neutral-700">
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-emerald-200 text-emerald-800">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Renter</th>
                <th className="py-3 px-4 text-left">Place</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b.id} className="border-b hover:bg-emerald-50">
                  <td className="py-2 px-4">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="py-2 px-4">{b.renter?.name || "-"}</td>
                  <td className="py-2 px-4">{b.place}</td>
                  <td className="py-2 px-4">
                    {format(new Date(b.startTime), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="py-2 px-4">
                    {format(new Date(b.endTime), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="py-2 px-4 font-medium">{b.amount} ฿</td>
                  <td
                    className={`py-1 px-3 font-semibold text-center ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </td>
                  <td className="py-2 px-4">
                    {b.canEnd ? (
                      <button
                        onClick={() => handleEnd(b.id)}
                        disabled={endingIds.includes(b.id)}
                        className={`px-3 py-1 rounded text-white transition ${
                          endingIds.includes(b.id)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-500"
                        }`}
                      >
                        {endingIds.includes(b.id) ? "Ending..." : "End"}
                      </button>
                    ) : (
                      <span className="text-neutral-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-emerald-300 text-emerald-800 rounded disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="text-emerald-800 font-medium">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-emerald-300 text-emerald-800 rounded disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      <style>
        {`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease forwards;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}
      </style>
    </div>
  );
}
