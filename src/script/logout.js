import api from "../api/apiClient";

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    await api.post("/api/auth/logout", { refreshToken });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};