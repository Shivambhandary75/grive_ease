import { Navigate } from "react-router-dom";
import { getToken } from "../utils/api";

// Protected Route Component - redirects to auth if not logged in
export default function ProtectedRoute({ children }) {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}
