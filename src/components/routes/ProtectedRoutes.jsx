import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/Usercontext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
