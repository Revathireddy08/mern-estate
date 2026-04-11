import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";



export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) return <div>Loading...</div>;

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}