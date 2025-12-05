import { useState, useEffect } from "react";
import MateNav from "./MateNav";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";

export default function RentingRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fetchRequests = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/booking/requests?page=${p}&pageSize=${pageSize}`
      );
      setRequests(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch requests error:", err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const handleAccept = async (id) => {
    try {
      await api.post(`/api/booking/${id}/accept`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r))
      );
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/api/booking/${id}/reject`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "refunded" } : r))
      );
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900">
      <MateNav />

      <div className="w-full max-w-3xl mx-auto mt-6 px-4 sm:px-6">
        <div className="bg-white ring-2 ring-emerald-200/70 rounded-2xl flex flex-col w-full min-h-[300px] shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between text-xl sm:text-2xl md:text-3xl p-4 border-b border-emerald-200 flex-shrink-0">
            <p className="font-semibold text-emerald-800">Renting Requests</p>
            <Link
              to="/mate"
              className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-transform hover:scale-110 flex items-center justify-center"
            >
              <FaHome size={22} />
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {loading ? (
              <p className="text-center text-emerald-600 py-6">Loading...</p>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-gradient-to-r from-white via-emerald-50 to-white hover:from-emerald-100 hover:to-emerald-100 p-4 sm:p-6 rounded-xl shadow-sm border border-emerald-200 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-base sm:text-lg text-emerald-800">
                        {req.renter
                          ? `${req.renter.name} ${req.renter.surName}`
                          : "Unknown"}
                      </p>

                      <p className="text-emerald-700 text-sm sm:text-base">
                        Date: {new Date(req.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-emerald-700 text-sm sm:text-base">
                        Time:{" "}
                        {new Date(req.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(req.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-emerald-700 text-sm sm:text-base">
                        Place: {req.place}
                      </p>
                      <p className="text-emerald-700 text-sm sm:text-base">
                        Purpose: {req.purpose}
                      </p>
                      {/* Show others if not empty */}
                      {req.others && req.others.trim().length > 0 && (
                        <p className="text-emerald-700 text-sm sm:text-base">
                          Others: {req.others}
                        </p>
                      )}
                      <p className="text-xs mt-1 italic text-gray-500">
                        Status: {req.status}
                      </p>
                    </div>

                    {req.status === "paid" && (
                      <div className="flex gap-2 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 text-white text-sm sm:text-base hover:bg-emerald-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-red-500 text-white text-sm sm:text-base hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-emerald-600 py-6">
                No requests found
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 p-3 border-t border-emerald-200 flex-shrink-0">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg bg-emerald-300 disabled:opacity-50 hover:bg-emerald-400 transition"
              >
                Prev
              </button>
              <span className="text-sm sm:text-base">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg bg-emerald-300 disabled:opacity-50 hover:bg-emerald-400 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
