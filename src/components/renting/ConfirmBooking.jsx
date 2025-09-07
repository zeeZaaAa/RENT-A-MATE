import CheckoutForm from "../payment/Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import api from "../../api/apiClient.js";
import { useLocation, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function ConfirmBooking() {
  const [booking, setBooking] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!bookingId) return;
    const getBookingData = async () => {
      try {
        const { data } = await api.get("/api/booking/booking-data", {
          params: { bookingId },
        });
        const bookingData = {
          ...data.booking,
          startTime: new Date(data.booking.startTime),
          endTime: new Date(data.booking.endTime),
        };
        setBooking(bookingData);
      } catch (error) {
        console.error("Failed to fetch booking data", error);
        const message =
          error.response?.data?.message ||
          "Failed to fetch booking data. Please try again.";
        alert(message);
        navigate("/renter");
      }
    };
    getBookingData();
  }, [bookingId, navigate]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <p className="text-blue-700 text-lg animate-pulse">Loading booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-6">
        {/* Booking Info */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-700">
            Booking Confirmation
          </h2>
          <p className="text-blue-600 mt-1">
            You're renting: <span className="font-medium">{booking.mateName} {booking.mateSurName}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-blue-700">
          <div className="flex flex-col bg-blue-50 p-4 rounded-lg">
            <span className="font-medium">Start Time:</span>
            <span>{booking.startTime.toLocaleString()}</span>
          </div>
          <div className="flex flex-col bg-blue-50 p-4 rounded-lg">
            <span className="font-medium">End Time:</span>
            <span>{booking.endTime.toLocaleString()}</span>
          </div>
          <div className="flex flex-col bg-blue-50 p-4 rounded-lg">
            <span className="font-medium">Place:</span>
            <span>{booking.place}</span>
          </div>
          <div className="flex flex-col bg-blue-50 p-4 rounded-lg">
            <span className="font-medium">Purpose:</span>
            <span>{booking.purpose}</span>
          </div>
          {booking.others && (
            <div className="col-span-1 sm:col-span-2 flex flex-col bg-blue-50 p-4 rounded-lg">
              <span className="font-medium">Others:</span>
              <span>{booking.others}</span>
            </div>
          )}
        </div>

        {/* Stripe Payment */}
        <div className="mt-4">
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={booking.amount} />
          </Elements>
        </div>

        <p className="text-center text-sm text-red-500 mt-4">
          *Booking is held for 10 minutes. Please confirm.
        </p>
      </div>
    </div>
  );
}
