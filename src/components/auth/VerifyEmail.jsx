import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACK_API}/api/auth/verify-email`, {
          params: { token },
        });
        setMessage("Email verified successfully! You may now login.");
      } catch (err) {
        const msg =
          err.response?.data?.message || "Something went wrong during verification.";
        setMessage(`Verification failed: ${msg}`);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="text-xl">{message}</p>
    </div>
  );
}
