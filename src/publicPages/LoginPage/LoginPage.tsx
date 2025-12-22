import { useKeycloak } from '@react-keycloak/web'
import { useEffect } from 'react';
function LoginPage() {

  const { keycloak } = useKeycloak();


  const handleKeycloakLogin = () => {
    keycloak.login({ redirectUri: "http://localhost:5173/dash" })
  }
  useEffect(() => {


    keycloak.init({ onLoad: 'login-required' }).then((auth) => {
      if (auth) {
        keycloak.loadUserProfile().then((profile) => {
          console.log(profile)
        })
      }
    })

  }, [])


  return (
    <div>LoginPage
      <button onClick={() => handleKeycloakLogin()}>Login</button>

    </div>
  )
}

export default LoginPage