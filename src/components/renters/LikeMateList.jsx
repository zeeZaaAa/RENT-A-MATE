import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaUser,
  FaHome,
  FaClock,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";

export default function LikeMateList() {
  const [mates, setMates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const matesPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedMates = async () => {
      try {
        const res = await api.get("/api/renter/likes", {
          params: { page: currentPage, pageSize: matesPerPage },
        });
        setMates(res.data.mates);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching mates:", err);
      }
    };
    fetchLikedMates();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* 🔹 ปุ่ม Home */}
        <Link
          to="/renter"
          className="absolute top-4 left-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition"
        >
          <FaHome size={20} />
        </Link>

        <h1 className="text-2xl font-bold text-center text-blue-800 mb-8">
          ❤️ Your Liked Mates
        </h1>

        {/* Mate Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mates.length === 0 ? (
            <p className="text-center col-span-full text-gray-600">
              No liked mates yet.
            </p>
          ) : (
            mates.map((mate) => (
              <div
                key={mate._id}
                onClick={() =>
                  navigate(`/renter/mate-profile?mateId=${mate._id}`)
                }
                className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center text-center border border-blue-200 hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={mate.profile}
                  alt={mate.name}
                  className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-blue-300"
                />
                <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <FaUser /> {mate.name}
                </h2>

                {/* Interest */}
                {mate.interest && mate.interest.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {mate.interest.map((item, index) => (
                      <span
                        key={index}
                        className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review Rate */}
                {mate.review_rate !== undefined && (
                  <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                    <FaStar /> {mate.review_rate.toFixed(1)}
                  </p>
                )}

                {/* Available Date */}
                {mate.avaliable_date && (
                  <p className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <FaCalendarAlt className="text-blue-500" />{" "}
                    {mate.avaliable_date}
                  </p>
                )}

                {/* Available Time */}
                {mate.avaliable_time?.length === 2 && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="text-blue-500" />{" "}
                    {mate.avaliable_time[0]} - {mate.avaliable_time[1]}
                  </p>
                )}

                {/* Introduce */}
                <p
                  className="text-gray-600 text-sm mt-3 px-3 py-2 rounded-md w-full break-words"
                  title={mate.introduce}
                >
                  {mate.introduce?.length > 50
                    ? mate.introduce.slice(0, 50) + "..."
                    : mate.introduce || "No introduction"}
                </p>

                {/* Like tag */}
                <div className="mt-3 flex items-center gap-2 text-blue-600 font-medium">
                  <FaHeart className="text-red-500" /> Liked
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-neutral-400 rounded-lg disabled:bg-gray-300"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-700 text-white"
                    : "bg-white text-blue-700 border border-blue-400"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-neutral-400 rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
