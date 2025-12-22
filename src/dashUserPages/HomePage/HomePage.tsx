import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>HomePage
      <Link to="/dash/nutrition">Nutrition Library</Link>
        
    </div>
  )
}

export default HomePage