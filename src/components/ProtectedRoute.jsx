import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    return (
        allowedRoles.includes(currentUser.role) 
        ? <Outlet/> 
        : auth?.user 
            ? <Navigate to="/" state={{ from: location }} replace />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;