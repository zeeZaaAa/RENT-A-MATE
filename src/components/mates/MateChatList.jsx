import ChatList from "../chat/ChatList";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function MateChatList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-emerald-50 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="pt-16">
        <ChatList />
      </div>
    </div>
  );
}
