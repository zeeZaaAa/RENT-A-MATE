// SignUp.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import SignUpForm from "./SignUpForm.jsx";
import { nameRegex, passwordRegex } from "./validators";
import PopUpSendEmail from "./PopUpSendEmail.jsx";

export default function SignUp({ compact, onClose }) {
  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [backMsg, setBackMsg] = useState("");
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    data.name = data.name.trim();
    data.surName = data.surName.trim();
    setEmail(data.email);

    if (!nameRegex.test(data.name)) {
      return setError("name", {
        type: "manual",
        message: "Name must be only Thai/English letters (2–30 chars)",
      });
    }

    if (!nameRegex.test(data.surName)) {
      return setError("surName", {
        type: "manual",
        message: "Surname must be only Thai/English letters (2–30 chars)",
      });
    }

    if (!passwordRegex.test(data.password)) {
      return setError("password", {
        type: "manual",
        message:
          "Password must be a-z A-Z 0-9, at least 8 characters, and no spaces",
      });
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACK_API}/api/auth/register`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        const { message } = res.data;
        setShowPopup(true);
        setBackMsg(message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setMsg(errorMsg);
    }
  };

  return (
    <div
      className={`${
        compact ? "w-full sm:w-auto" : "w-screen h-screen"
      } flex justify-center items-center`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-100/30 backdrop-blur-[1px] border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 w-full sm:w-96 transition-all duration-300 hover:shadow-3xl"
      >
        <h1 className="text-2xl font-bold text-center text-neutral-700 drop-shadow-md">
          Sign Up
        </h1>

        <SignUpForm register={register} errors={errors} watch={watch} />

        {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}

        <button
          type="submit"
          className="bg-neutral-200/40 hover:bg-neutral-200/60 text-neutral-700 py-2 rounded font-semibold transition-all"
        >
          Sign Up
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-center text-neutral-700/70 hover:text-neutral-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>

      {showPopup && <PopUpSendEmail backMsg={backMsg} email={email} />}
    </div>
  );
}
