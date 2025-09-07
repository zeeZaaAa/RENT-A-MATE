import { io } from "socket.io-client";
import api, { setAccessToken } from "./apiClient"; 

let socket;

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
};

export const connectSocket = async () => {
  let accessToken = localStorage.getItem("accessToken");

  // ถ้า access token หมดอายุ ให้ลอง refresh ก่อน connect
  if (!isTokenValid(accessToken)) {
    try {
      const res = await api.post("/api/auth/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      accessToken = res.data.accessToken;
      setAccessToken(accessToken);
    } catch (err) {
      console.error("Cannot refresh token:", err);
      localStorage.clear();
      window.location.href = "/auth/logIn";
      return null;
    }
  }

  // สร้าง socket ด้วย token ที่ valid
  socket = io(import.meta.env.VITE_BACK_API, {
    auth: { token: accessToken },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to WS:", socket.id);
  });

  socket.on("disconnect", async (reason) => {
    console.log("Disconnected:", reason);

    if (reason === "io server disconnect") {
      try {
        const res = await api.post("/api/auth/refresh-token", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        socket.auth = { token: newAccessToken };
        socket.connect();
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.clear();
        window.location.href = "/auth/logIn";
      }
    }
  });

  return socket;
};

export const getSocket = () => socket;
