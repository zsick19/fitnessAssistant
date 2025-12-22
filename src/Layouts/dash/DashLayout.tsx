import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom'
import DashNav from './DashNav';
import { useEffect, useState } from 'react';
import '../dash/DashNavStyles.css'

function DashLayout() {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) { return <div>Loading Authentication...</div> }
  if (!keycloak.authenticated) return <Navigate to={'/login'} replace state={{ from: location.pathname }} />

  return (
    <>
      {<DashNav />}
      <div id='dashContainer'>
        <Outlet />
      </div>
    </>
  )
}

export default DashLayout