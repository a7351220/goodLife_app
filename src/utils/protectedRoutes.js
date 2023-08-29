import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useContext } from "react";
import { UserContext } from "./UserContext";
const ProtectedRoutes = () => {
    const location = useLocation()
    const { user } = useContext(UserContext)
    return user 
        ? <Outlet />
        : <Navigate to='/' replace state={{ from: location }} />
            
}

export default ProtectedRoutes;