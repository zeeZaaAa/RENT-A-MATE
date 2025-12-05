import MateNav from "./MateNav";
import MateProfile from "./MateProfile";
import MateBioDetail from "./MateBioDetail";
import EditProfile from "./EditProfile";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { logout } from "../../script/logout.js";

export default function MateHome() {
  const [mateData, setMateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMateProfile = async () => {
      try {
        const res = await api.get("/mate/me");
        const data = res.data;

        setMateData(data);

        const requiredFields = [
          "skill",
          "avaliable_date",
          "avaliable_time",
          "interest",
          "introduce",
          "price_rate",
          "city",
        ];

        const missingFields = requiredFields.filter(
          (field) => !data[field] || data[field]?.length === 0
        );

        if (missingFields.length > 0) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching mate profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-emerald-900">
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!mateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-emerald-900">
        <p className="text-lg font-medium text-red-500">
          Profile not found. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900 flex flex-col">
      <MateNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 lg:px-16 py-6 w-full">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center w-full max-w-6xl mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">
                Profile
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
              >
                <FaEdit />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl">
              {/* Profile Card */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <MateProfile mateData={mateData} />
              </div>

              {/* Bio Detail */}
              <div className="bg-white shadow-lg rounded-2xl p-6">
                <MateBioDetail mateData={mateData} />
              </div>
            </div>
          </>
        ) : (
          <EditProfile
            onBack={() => setIsEditing(false)}
            mateData={mateData}
            setMateData={setMateData}
          />
        )}
      </main>

      <div className="w-full max-w-6xl mt-6 flex justify-start px-4 md:px-8 lg:px-16">
        <button
          onClick={logout}
          className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 transition"
        >
          Logout
        </button>
      </div>

      <footer className="bg-emerald-600 text-white text-center py-3 mt-6">
        © 2025 Rent a Mate
      </footer>
    </div>
  );
}
