import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return isAdmin() ? children : <Navigate to="/main" replace />;
};

export default AdminRoute;
