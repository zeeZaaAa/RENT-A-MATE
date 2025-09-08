import RenterNav from "../renters/RenterNav";
import MateDetail from "./MateDetail";
import RentingForm from "./RentingForm";
import { useForm, Controller } from "react-hook-form";
import api from "../../api/apiClient.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Renting() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, watch, formState, setValue } =
    useForm();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mateId = searchParams.get("mateId");
  const [mateProfile, setMateProfile] = useState(null);

  useEffect(() => {
    if (!mateId) return;
    const getMateProfile = async () => {
      try {
        const { data } = await api.get("/api/booking/mate-profile", {
          params: { mateId },
        });
        setMateProfile(data.mateProfile);
      } catch (err) {
        console.error("Failed to request:", err);
        // Alert the error message from backend if available
        const message =
          err.response?.data?.message ||
          "Failed to fetch mate profile. Please try again.";
        alert(message);
        navigate("/renter");
      }
    };
    getMateProfile();
  }, [mateId]);

  const onSubmit = async (data) => {
    try {
      if (!data.others) data.others = "";

      // แปลง Date object ให้เป็น Bangkok local string "YYYY-MM-DDTHH:mm"
      const startBangkok = new Date(data.startTime);
      const endBangkok = new Date(data.endTime);

      const formatLocal = (d) => {
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      const payload = {
        ...data,
        startTime: formatLocal(startBangkok),
        endTime: formatLocal(endBangkok),
      };
      console.log("submitdata:", payload);
      const res = await api.post(`/api/booking/book?mateId=${mateId}`, payload);
      navigate(
        `/renter/renting/confirmbooking?bookingId=${res.data.bookingId}`
      );
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed, please try again.");
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen text-gray-800 flex flex-col">
      <RenterNav />
      <main className="flex-1 mx-4 sm:mx-6 lg:mx-12 mt-6 mb-12">
        {mateProfile ? (
          <>
            <MateDetail mateProfile={mateProfile} />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-3xl mx-auto mt-8 flex flex-col space-y-6 bg-white shadow-lg rounded-2xl p-6 sm:p-8"
            >
              <RentingForm
                register={register}
                Controller={Controller}
                control={control}
                watch={watch}
                formState={formState}
                mateData={mateProfile}
                setValue={setValue}
              />

              <div className="flex flex-col items-center mt-4">
                <p className="text-sm text-red-500 text-center mb-4 px-2">
                  *Your booking is not confirmed until payment is completed.
                  **You cannot make an overnight booking.
                </p>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-transform hover:scale-105 w-full sm:w-auto"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-center text-blue-600 text-lg mt-20">Loading...</p>
        )}
      </main>
    </div>
  );
}
