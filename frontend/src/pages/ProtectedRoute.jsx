import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";



const ProtectedRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

// loading state (prevents flicker)
if (isLoading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3 bg-base-100">
      
      {/* Spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-base-300"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>

      {/* Text */}
      <p className="text-sm text-base-content/60 animate-pulse">
        Loading your experience...
      </p>
    </div>
  );
}

  // if not logged in → redirect
  if (isError || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  // if logged in → allow access
  return <Outlet />;
};

export default ProtectedRoute;