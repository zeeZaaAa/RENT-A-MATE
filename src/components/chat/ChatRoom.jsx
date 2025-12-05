import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RenterNav from "../renters/RenterNav";
import MateNav from "../mates/MateNav";
import { IoChevronBackSharp } from "react-icons/io5";
import SendMsgBar from "./SendMsgBar";
import { connectSocket, getSocket } from "../../api/socketClient";
import api from "../../api/apiClient";

export default function ChatRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mateInfo, setMateInfo] = useState(null);

  const messageEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const isRenter = user.role === "renter";

  const primaryColor = isRenter ? "blue" : "emerald";

  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;
      try {
        const [msgRes, roomRes] = await Promise.all([
          api.get(`/api/chat/message/${roomId}`, {
            params: { page: 1, pageSize: 50 },
          }),
          api.get(`/api/chat/room/${roomId}`),
        ]);

        setMessages(msgRes.data.messages || []);

        const participant = roomRes.data.participants.find(
          (p) => p._id !== userId
        );
        setMateInfo(participant);
      } catch (err) {
        console.error("Load messages or room info error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    let socket;

    const initSocket = async () => {
      socket = await connectSocket();
      socket.emit("joinRoom", roomId);

      socket.on("newMessage", (msg) => {
        if (msg.chatRoomId === roomId) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    };

    initSocket();
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text) => {
    const socket = getSocket();
    if (!socket || !roomId || !text.trim()) return;

    socket.emit("sendMessage", { roomId, text });
  };

  return (
    <div
      className={`min-h-screen ${
        isRenter ? "bg-blue-50" : "bg-emerald-50"
      } text-neutral-700`}
    >
      {isRenter ? <RenterNav /> : <MateNav />}

      <div className="w-full max-w-full sm:max-w-xl mx-auto mt-4 sm:mt-6 p-2 sm:p-4">
        <div
          className={`flex flex-col w-full min-h-180 sm:min-h-200 rounded-2xl shadow-lg border border-${primaryColor}-300 bg-white`}
        >
          {/* Header */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3 p-4 border-b border-${primaryColor}-300 flex-shrink-0`}
          >
            <div
              className={`hover:text-${primaryColor}-500 cursor-pointer text-2xl`}
              onClick={() => navigate(-1)}
            >
              <IoChevronBackSharp />
            </div>

            {mateInfo ? (
              <div className="flex items-center space-x-3">
                <img
                  src={mateInfo.pic.secure_url}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80"
                  onClick={() => {
                    if (isRenter) {
                      navigate(`/renter/mate-profile?mateId=${mateInfo._id}`);
                    }
                  }}
                />
                <p className="font-semibold text-lg sm:text-2xl">
                  {mateInfo.name} {mateInfo.surName}
                </p>
              </div>
            ) : (
              <p className="font-semibold text-xl">Chat Room</p>
            )}
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {loading && <p className="text-center py-6">Loading...</p>}
            {!loading &&
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 p-3 md:p-4 lg:p-5 rounded-lg shadow-sm border border-gray-200 ${
                    msg.sender === userId
                      ? `bg-${primaryColor}-100 self-end`
                      : "bg-neutral-200 self-start"
                  }`}
                >
                  <p className="font-semibold text-sm sm:text-base">
                    {msg.sender === userId ? "You" : `${mateInfo.name}`}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {msg.text}
                  </p>
                </div>
              ))}
            <div ref={messageEndRef} />
          </div>

          {/* Send Message Bar */}
          <div className="flex-shrink-0 border-t border-gray-300">
            <SendMsgBar
              onSend={handleSendMessage}
              primaryColor={primaryColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
