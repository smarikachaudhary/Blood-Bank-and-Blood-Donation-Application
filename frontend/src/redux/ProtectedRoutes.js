import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
