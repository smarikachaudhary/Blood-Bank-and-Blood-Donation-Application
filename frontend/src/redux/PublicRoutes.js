import { Navigate, Outlet } from "react-router-dom";

const Public = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
};

export default Public;
