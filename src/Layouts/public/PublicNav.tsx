import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { Link } from 'react-router-dom'

function PublicNav() {
  
  return (
    <nav>
      PublicNav
    <Link to={'/login'}>Login</Link>

    </nav>
  )
}

export default PublicNav