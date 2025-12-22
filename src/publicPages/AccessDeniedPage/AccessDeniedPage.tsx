import React from 'react'
import { useNavigate } from 'react-router-dom'

function AccessDeniedPage() {
  const navigate=useNavigate()
  return (
    <div>
      AccessDeniedPage
      <button onClick={()=>navigate(-1)}>Go Back</button>
    </div>
  )
}

export default AccessDeniedPage