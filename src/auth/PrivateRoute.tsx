import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context"
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps{
    children:React.ReactNode
    requiredRole?:string
}

const PrivateRoute:React.FC<PrivateRouteProps>=({children,requiredRole})=>{
    
    const {keycloak}=useKeycloak()
    const location=useLocation();


    const realmRoles=keycloak.tokenParsed?.realm_access?.roles||[];
    const clientRoles=keycloak.tokenParsed?.resource_access
    console.log(realmRoles)
    console.log(clientRoles)

    const hasRequiredRole=requiredRole?Array.isArray(realmRoles) && realmRoles.includes(requiredRole):true;

    if(keycloak.authenticated &&!hasRequiredRole) {return <Navigate to="/accessDenied" state={{from:location}} replace/>}
    if(!keycloak.authenticated) return null

    return <>{children}</>
}

export default PrivateRoute