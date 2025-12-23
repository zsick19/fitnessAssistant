import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { Link } from 'react-router-dom'
import './PublicNavStyles.css'

function PublicNav() {

  const { keycloak } = useKeycloak();

  return (
    <nav id='publicNav'>
      <button><Link to={'/'}>Company</Link></button>
      <div>
        <button><Link to={'/'}>Learn Fitness</Link></button>
        <button><Link to={'/'}>Learn Nutrition</Link></button>
      </div>

      <div>
        <button><Link to={'/register'}>Register</Link></button>
        <button onClick={() => keycloak.login({ redirectUri: 'http://localhost:5173/dash' })}>Login</button>
      </div>
    </nav>
  )
}

export default PublicNav