import {Navigate, Outlet} from 'react-router-dom'
import PublicNav from './PublicNav'
import { useKeycloak } from '@react-keycloak/web'


function PublicLayout() {
    const {keycloak}=useKeycloak()
    // if(keycloak.authenticated) return<Navigate to={'/dash'}/>

    return (
    <>
    <PublicNav/>
    <div>
        <Outlet/>
    </div>
    </>
  )
}

export default PublicLayout