import { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken } from "../../api/apiClient.js";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // user = { id, name, surName, role } หรือ null
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
      // อัปเดต accessToken ด้วย ถ้ามี
      const token = localStorage.getItem("accessToken");
      setAccessToken(token || null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // sync user + token ลง localStorage ทุกครั้งที่เปลี่ยน
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      const token = localStorage.getItem("accessToken");
      setAccessToken(token || null);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
    }
  }, [user]);

  const login = ({ user, accessToken, refreshToken }) => {
    setUser(user); // เก็บเฉพาะข้อมูล user
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
