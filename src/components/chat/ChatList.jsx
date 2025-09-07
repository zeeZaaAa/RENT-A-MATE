import { useState, useEffect, useMemo } from "react";
import api from "../../api/apiClient";
import { IoChatbubbleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const [page, setPage] = useState(1);
  const [chats, setChats] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "renter";

  const pageSize = 6;
  const navigate = useNavigate();

  // ---- Fetch chats from backend ----
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/chat", { params: { page, pageSize } });
        setChats(res.data.chatList);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [page]);

  // ---- Theme config ----
  const theme = useMemo(() => {
    if (role === "mate") {
      return {
        primary: "text-emerald-600",
        hover: "hover:bg-emerald-50",
        unread: "bg-emerald-500",
        border: "border-emerald-200",
      };
    }
    return {
      primary: "text-blue-600",
      hover: "hover:bg-blue-50",
      unread: "bg-blue-500",
      border: "border-blue-200",
    };
  }, [role]);


  return (
    <div className="w-full max-w-full sm:max-w-xl mx-auto mt-4 sm:mt-6 p-2 sm:p-4">
      <div
        className={`bg-white border ${theme.border} rounded-2xl flex flex-col w-full min-h-[300px] shadow-md`}
      >
        {/* Header */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-2xl md:text-3xl p-4 border-b border-gray-200 flex-shrink-0 text-neutral-800">
          <div className={`p-1 ${theme.primary}`}>
            <IoChatbubbleSharp />
          </div>
          <p className="font-semibold">Chats</p>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 divide-y divide-gray-100">
          {loading && <p className="text-center py-6">Loading...</p>}
          {error && <p className="text-center py-6 text-red-500">{error}</p>}
          {!loading && !error && chats.length === 0 && (
            <p className="text-center text-gray-500 py-6">No chats found</p>
          )}
          {!loading &&
            !error &&
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chat?roomId=${chat.roomId}`)}
                className={`flex justify-between items-center py-3 px-2 rounded-lg cursor-pointer ${theme.hover} transition`}
              >
                <div className="flex items-center gap-3">
                  {/* รูป profile */}
                  <img
                    src={chat.pic.secure_url}
                    alt={chat.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm sm:text-base text-gray-800">
                      {chat.user}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm truncate max-w-[200px]">
                      {chat.message}
                    </p>
                  </div>
                </div>

                {chat.unread && (
                  <span className={`w-3 h-3 ${theme.unread} rounded-full`} />
                )}
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-3 border-t border-gray-200 flex-shrink-0">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-200"
            >
              Prev
            </button>
            <span className="text-sm sm:text-base font-medium">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
