import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Current state:", {
    isAuthenticated,
    isLoading,
    requireAuth,
    pathname: location.pathname,
    hasUser: !!user,
    hasToken: !!token,
    userId: user?._id,
  });

  // Show loading while checking authentication
  if (isLoading) {
    console.log("ProtectedRoute - Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log("ProtectedRoute - Redirecting to login (not authenticated)");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route doesn't require authentication and user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    console.log(
      "ProtectedRoute - Redirecting to dashboard (already authenticated)"
    );
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ProtectedRoute - Rendering children");
  return children;
}
