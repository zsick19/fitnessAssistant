import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {

  return (
    <div className='flex'>
      HomePage
      <Link to="/dash/nutrition">Nutrition Library</Link>
      <Link to="/dash/nutrition/contributor/foodMeal/c0a54275-705f-497f-b005-744aaf34ced9/edit">Edit work</Link>

    </div>
  )
}

export default HomePage