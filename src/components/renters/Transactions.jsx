import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { format } from "date-fns";
import { FaHome } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cancelingIds, setCancelingIds] = useState([]);
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const pageSize = 10;

  const fetchTransactions = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/booking/transactions?page=${pageNum}&pageSize=${pageSize}`
      );
      setTransactions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("Failed to fetch transactions: " + message);
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancelingIds((prev) => [...prev, id]);
      await api.post(`/api/booking/cancel/${id}`);
      fetchTransactions(page);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("Cancel failed: " + message);
      console.error("Cancel failed:", err);
    } finally {
      setCancelingIds((prev) => prev.filter((cId) => cId !== id));
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    try {
      setSubmitting(true);
      await api.post(`/review/booking/${reviewingId}`, { rating });
      alert("Review submitted!");
      setReviewingId(null);
      setRating(0);
      fetchTransactions(page);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      alert("Review failed: " + message);
      console.error("Review failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      paid: "text-blue-800",
      refunded: "text-red-600",
      confirmed: "text-yellow-500",
      end: "text-green-600",
      reviewed: "text-purple-600",
    };
    return map[status] || "bg-gray-200 text-gray-800";
  };

  return (
    <div className="p-4 md:p-8 bg-blue-50 min-h-screen relative">
      {/* Home Button */}
      <Link
        to="/renter"
        className="absolute top-4 left-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition z-20"
      >
        <FaHome size={20} />
      </Link>

      {/* Title Centered */}
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          My Transactions
        </h1>
      </div>

      {/* Loading & Empty State */}
      {loading ? (
        <div className="text-center text-blue-700 py-10">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-blue-700 py-10">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white text-neutral-700">
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-blue-200 text-blue-800">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Mate</th>
                <th className="py-3 px-4 text-left">Place</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={t.id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="py-2 px-4">{t.mate?.name || "-"}</td>
                  <td className="py-2 px-4">{t.place}</td>
                  <td className="py-2 px-4">{format(new Date(t.startTime), "dd/MM/yyyy HH:mm")}</td>
                  <td className="py-2 px-4">{format(new Date(t.endTime), "dd/MM/yyyy HH:mm")}</td>
                  <td className="py-2 px-4 font-medium">{t.amount} ฿</td>
                  <td className={`py-1 px-3 font-semibold text-center ${getStatusBadge(t.status)}`}>{t.status}</td>
                  <td className="py-2 px-4">
                    {t.canCancel ? (
                      <button
                        onClick={() => handleCancel(t.id)}
                        disabled={cancelingIds.includes(t.id)}
                        className={`px-3 py-1 rounded text-white transition ${cancelingIds.includes(t.id) ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-400"}`}
                      >
                        {cancelingIds.includes(t.id) ? "Canceling..." : "Cancel"}
                      </button>
                    ) : t.canReview ? (
                      <button
                        onClick={() => setReviewingId(t.id)}
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-white transition"
                      >
                        Review
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

      {/* Review Modal */}
      {reviewingId && (
        <div className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md mx-2 md:mx-0">
            {/* Close button */}
            <button
              onClick={() => setReviewingId(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl"
            >
              <RxCross2 />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
              Leave a Review
            </h2>

            <div className="flex justify-center mb-6 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || reviewingId}
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="text-blue-800 font-medium">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || reviewingId}
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
