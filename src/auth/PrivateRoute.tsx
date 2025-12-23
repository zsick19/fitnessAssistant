import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context"
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {

    requiredRole?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole }) => {
    const { keycloak } = useKeycloak()
    const location = useLocation();

    const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    let hasRequiredRole = false;

    requiredRole?.map((role) => {
        if (realmRoles.includes(role)) {
            hasRequiredRole = true
            return;
        }
    })



    if (keycloak.authenticated && !hasRequiredRole) { return <Navigate to="/accessDenied" state={{ from: location }} replace /> }

    return <Outlet />
}

export default PrivateRoute