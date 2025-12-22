import { useKeycloak } from '@react-keycloak/web'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../dash/DashNavStyles.css'

function DashNav() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    if (keycloak.authenticated) { keycloak.loadUserProfile().then((t) => setUserName(t.username)) }
  }, [])

  const [currentEnv, setCurrentEnv] = useState("/dash");

  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isFitnessAdmin = realmRoles.includes('FitnessAdmin')
  const isNutritionAdmin = realmRoles.includes('NutritionAdmin')
  const isFitnessContributor = realmRoles.includes('FitnessContributor')
  const isNutritionContributor = realmRoles.includes('NutritionContributor')

  const provideAdminPortal = () => {
    if (isFitnessAdmin && isNutritionAdmin) return (<>
      <button onClick={() => handlePortalChange('/dash/nutrition/admin')}>Nutrition Admin</button>
      <button onClick={() => handlePortalChange('/dash/fitness/admin')}>Fitness Admin</button>
    </>)
    else if (isFitnessAdmin) return <button onClick={() => handlePortalChange('/dash/fitness/admin')}>Fitness Admin</button>
    else if (isNutritionAdmin) return <button onClick={() => handlePortalChange('/dash/nutrition/admin')}>Nutrition Admin</button>
  }
  const provideContributorPortal = () => {
    if (isFitnessContributor && isNutritionContributor) return (<>
      <button onClick={() => handlePortalChange('/dash/nutrition/contributor')}>F C</button>
      <button onClick={() => handlePortalChange('/dash/nutrition/contributor')}>N C</button>
    </>)
    else if (isFitnessContributor) return <button onClick={() => handlePortalChange('/dash/fitness/contributor')}>FC</button>
    else if (isNutritionContributor) return <button onClick={() => handlePortalChange('/dash/nutrition/contributor')}>NC</button>
  }
  const handlePortalChange = (locationToNav: string) => {
    setCurrentEnv(locationToNav)
    navigate(locationToNav)
  }

  const isAdminLocation = location.pathname.split('/')[3] === 'admin'
  const isContributorLocation = location.pathname.split('/')[3] === 'contributor'






  return (
    <nav className='flex' id='dashNav'>

      <Link to={currentEnv}>Home</Link>

      <div>
        {isAdminLocation || isContributorLocation ? <button onClick={() => handlePortalChange('/dash')}>Home Portal</button> :
          isFitnessAdmin || isNutritionAdmin ? provideAdminPortal() :
            isFitnessContributor || isNutritionContributor ? provideContributorPortal() :
              <button>Become a Contributor</button>}
      </div>

      <div>
        {userName}
        <button onClick={() => keycloak.logout({ redirectUri: "http://localhost:5173" })}>Logout</button>
      </div>
    </nav>
  )
}

export default DashNav