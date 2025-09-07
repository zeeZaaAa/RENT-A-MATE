import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/apiClient.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/Usercontext";

function Login({ compact, onClose }) {
  const { login } = useUser() || {};
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", data);
      if (login)
        login({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full sm:w-auto ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-neutral-100/30 backdrop-blur-[1px] border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 w-full sm:w-96
      transition-all duration-300 hover:shadow-3xl"
      >
        <h1 className="text-2xl font-bold text-center text-neutral-700 drop-shadow-md">
          Log In
        </h1>

        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          className="border border-neutral-300 bg-neutral-100/30 p-2 rounded text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className="border border-neutral-300 bg-neutral-100/30 p-2 rounded text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {msg && <p className="text-red-500 text-center">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-neutral-200/40 hover:bg-neutral-200/60 text-neutral-700 py-2 rounded font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
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
    </div>
  );
}

export default Login;
