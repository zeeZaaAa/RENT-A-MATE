// MateProfileforRenter.jsx
import MateProfile from "../mates/MateProfile";
import MateBioDetail from "../mates/MateBioDetail";
import { FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import api from "../../api/apiClient";

export default function MateProfileforRenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mateId = queryParams.get("mateId");

  const [mateData, setMateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // ✅ ดึงข้อมูล mate
  useEffect(() => {
    async function fetchMate() {
      try {
        const res = await api.get(`/search/mate-data`, { params: { mateId } });
        setMateData(res.data);
      } catch (err) {
        console.error("Failed to fetch mate:", err);
      } finally {
        setLoading(false);
      }
    }
    if (mateId) fetchMate();
  }, [mateId]);

  // ✅ เช็คว่า liked หรือยัง
  useEffect(() => {
    async function checkIsLiked() {
      if (!mateId) return;
      try {
        const res = await api.get(`/search/isLiked`, { params: { mateId } });
        setIsLiked(res.data.isLiked);
      } catch (err) {
        console.error("Failed to check isLiked:", err);
      }
    }
    checkIsLiked();
  }, [mateId]);

  const handleLikeClick = async () => {
    if (!mateId) return alert("You need to login as renter first!");

    setLikeLoading(true);
    try {
      const res = await api.post("/api/renter/likes/toggle", { mateId });

      const updatedLiked = res.data.liked || [];

      setIsLiked(updatedLiked.some((mate) => mate._id.toString() === mateId));

      console.log(res.data.message);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLikeLoading(false);
    }
  };

  // ✅ chat
  const handleChatClick = async () => {
    if (!mateId) return;
    setChatLoading(true);
    try {
      const res = await api.post("/api/chat/create", {
        participantId: mateId,
        participantRole: "mate",
      });
      const roomId = res.data.chatRoom?.id;
      if (roomId) {
        navigate(`/chat?roomId=${roomId}`);
      } else {
        alert("No roomId returned from API");
      }
    } catch (err) {
      console.error("Failed to create chat room:", err);
      alert(
        err.response?.data?.message || "Failed to start chat. Please try again."
      );
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 font-semibold text-lg">
        loading...
      </div>
    );
  }

  if (!mateData) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold text-lg">
        Error 404: Mate not found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          to="/renter"
          className="absolute top-4 left-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition"
        >
          <FaHome size={20} />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <MateProfile mateData={mateData} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4">
          {/* Chat */}
          <button
            onClick={handleChatClick}
            disabled={chatLoading}
            className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 transition disabled:opacity-50"
          >
            <IoChatbubbleOutline size={20} />
            <span className="hidden sm:inline font-medium">
              {chatLoading ? "Starting..." : "Chat"}
            </span>
          </button>

          {/* Rent */}
          <Link to={`/renter/renting?mateId=${mateId}`}>
            <button className="flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition">
              Rent Now
            </button>
          </Link>

          {/* Like */}
          <button
            onClick={handleLikeClick}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-md border transform transition 
              ${
                isLiked
                  ? "bg-red-500 text-white border-red-600 hover:scale-105"
                  : "bg-white text-red-500 border-red-200 hover:bg-red-50 hover:scale-105"
              }`}
          >
            {likeLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
            ) : (
              <FaHeart
                size={20}
                className={`${isLiked ? "animate-pulse" : ""}`}
              />
            )}
            <span className="hidden sm:inline font-medium">
              {isLiked ? "Liked" : "Like"}
            </span>
          </button>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <MateBioDetail mateData={mateData} />
        </div>
      </div>
    </div>
  );
}
