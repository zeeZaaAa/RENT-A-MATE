import api from "../api/apiClient";

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    // เรียก server ลบ refresh token
    await api.post("/api/auth/logout", { refreshToken });

    // ลบ token ใน client
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // redirect ไปหน้า login
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};