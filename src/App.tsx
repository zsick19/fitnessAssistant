import './App.css'

import { Route, Routes } from 'react-router-dom'
import PublicLayout from './Layouts/public/PublicLayout'
import LandingPage from './publicPages/LandingPage/LandingPage'
import DashLayout from './Layouts/dash/DashLayout'
import HomePage from './dashUserPages/HomePage/HomePage'
import LoginPage from './publicPages/LoginPage/LoginPage'
import AccessDeniedPage from './publicPages/AccessDeniedPage/AccessDeniedPage'
import PrivateRoute from './auth/PrivateRoute'
import FitnessAdminHomePage from './dashAdminPages/Fitness/FitnessAdminHomePage/FitnessAdminHomePage'
import FitnessContributorHomePage from './dashContributorPages/Fitness/FitnessContributorHomePage/FitnessContributorHomePage'
import NutritionContributorHomePage from './dashContributorPages/Nutrition/NutritionContributorHomePage/NutritionContributorHomePage'
import NutritionAdminHomePage from './dashAdminPages/Nutrition/NutritionAdminHomePage/NutritionAdminHomePage'
import NutritionHomePage from './dashUserPages/Nutrition/NutritionHomePage/NutritionHomePage'
import FoodMealCreatePage from './dashContributorPages/Nutrition/FoodMealCreatePage/FoodMealCreatePage'
import FoodMealEditPage from './dashContributorPages/Nutrition/FoodMealEditPage/FoodMealEditPage'
import Prefetch from './features/Prefetch'


function App() {


  return (
    <Routes>
      <Route path='/' element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path='login' element={<LoginPage />} />
      </Route>

      <Route path='/dash' element={<DashLayout />}>
        <Route element={<Prefetch />}>        
          <Route index element={<HomePage />} />


          <Route path='nutrition'>
            <Route index element={<NutritionHomePage />}>
              {/* User Nutrition Routes */}
            </Route>

            <Route path='contributor' element={<PrivateRoute requiredRole={['NutritionContributor', 'NutritionAdmin']} />}>
              <Route index element={<NutritionContributorHomePage />} />
              <Route path='foodMeal/create' element={<FoodMealCreatePage />} />
              <Route path='foodMeal/:id/edit' element={<FoodMealEditPage />} />
              {/* Contributor Nutrition Routes */}
            </Route>

            <Route path='admin' element={<PrivateRoute requiredRole={['NutritionAdmin']} />}>
              <Route index element={<NutritionAdminHomePage />} />
              {/* Admin Nutrition Routes */}
            </Route>
          </Route>

          <Route path='fitness'>
            <Route index element={<div>User Fitness library</div>}>
              {/* User fitness Routes */}
            </Route>
            <Route path='contributor' element={<PrivateRoute requiredRole={['FitnessContributor', 'FitnessAdmin']} />}>
              <Route index element={<FitnessContributorHomePage />} />
              {/* Contributor Fitness Routes */}
            </Route>


            <Route path='admin' element={<PrivateRoute requiredRole={['FitnessAdmin']} />}>
              <Route index element={<FitnessAdminHomePage />} />
              {/* Admin Fitness Routes */}
            </Route>
          </Route>

          <Route path='commitment'>

          </Route>

        </Route>
      </Route>


      <Route path='accessDenied' element={<AccessDeniedPage />} />
    </Routes>
  )
}

export default App
