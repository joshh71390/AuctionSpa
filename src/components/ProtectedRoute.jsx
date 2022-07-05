import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserFromStorage } from "../utility/storage";

const ProtectedRoute = ({ allowedRoles }) => {
    const currentUser = getUserFromStorage();
    const location = useLocation();

    return allowedRoles.includes(currentUser?.role.toLowerCase()) ?
    <Outlet/> :
    <Navigate to={'/auth'} state={{'from': location}} replace/>
}

export default ProtectedRoute;