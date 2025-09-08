import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/Usercontext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useUser();

  if (!user) {
    // ถ้าไม่ได้ login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // ถ้า role ไม่ตรง
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
