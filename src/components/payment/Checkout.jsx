import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await api.post(
          `/api/payment/create-payment-intent?bookingId=${bookingId}`,
          {
            amount,
          }
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          console.error(
            "Failed to create payment intent:",
            err.response.data.message
          );
        } else {
          console.error("Failed to create payment intent:", err);
        }
      }
    };
    if (amount) createPaymentIntent();
  }, [amount, bookingId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      try {
        await api.post(`/api/booking/confirmbooking`, null, {
          params: { bookingId },
        });
        alert("Booking confirmed");
        navigate("/renter");
      } catch (err) {
        if (err.response) {
          if (err.response.status === 410) {
            alert("Booking expired. Please try again.");
            navigate("/renter");
          } else if (err.response.data && err.response.data.message) {
            alert(`Booking Error: ${err.response.data.message}`);
            console.log("Error details:", err.response.data);
          } else {
            alert("Booking Error, please check log");
            console.error("Error response:", err.response);
          }
        } else {
          alert("Failed to confirm booking. Please try again.");
          console.error("Error:", err);
        }
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-4 bg-white rounded-lg shadow-md space-y-4"
    >
      {/* Card Input */}
      <div className="border p-3 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#333",
                "::placeholder": { color: "#888" },
              },
            },
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ${amount} ฿`}
      </button>
    </form>
  );
};

export default CheckoutForm;
