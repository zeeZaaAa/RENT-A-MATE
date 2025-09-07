import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./components/auth/VerifyEmail.jsx";
import RenterHome from "./components/renters/RenterHome.jsx";
import ChatRoom from "./components/chat/ChatRoom.jsx";
import MateHome from "./components/mates/MateHome.jsx";
import MateProfileforRenter from "./components/renters/MateProfileforRenter.jsx";
import Renting from "./components/renting/Renting.jsx";
import ConfirmBooking from "./components/renting/ConfirmBooking.jsx";
import UnauthorizedPage from "./components/routes/UnauthorizedPage.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoutes.jsx";
import RentingRequest from "./components/mates/RentingRequest.jsx";
import LikeMateList from "./components/renters/LikeMateList.jsx";
import Transactions from "./components/renters/Transactions.jsx";
import Booking from "./components/mates/Booking.jsx";
import Home from "./components/homePage/Home.jsx";
import MateChatList from "./components/mates/mateChatList.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/verify" element={<VerifyEmail />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route element={<ProtectedRoute allowedRoles={["renter"]} />}>
          <Route path="/renter" element={<RenterHome />} />
          <Route path="/renter/like" element={<LikeMateList />} />
          <Route path="/renter/booking-transactions" element={<Transactions />} />
          <Route
            path="/renter/mate-profile"
            element={<MateProfileforRenter />}
          />
          <Route path="/renter/renting" element={<Renting />} />
          <Route
            path="/renter/renting/confirmbooking"
            element={<ConfirmBooking />}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["mate"]} />}>
          <Route path="/mate" element={<MateHome />} />
          <Route path="/mate/renting-request" element={<RentingRequest />} />
          <Route path="/mate/booking-transactions" element={<Booking />} />
          <Route path="/mate/chat-list" element={<MateChatList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
