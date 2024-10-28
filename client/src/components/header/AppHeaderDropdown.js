import React from 'react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()  // Initialize the useNavigate hook for redirection

  // Handle logout
  const handleLogout = () => {
    // Check if Admin or User is logged in and remove the respective item from localStorage
    if (localStorage.getItem('admin')) {
      localStorage.removeItem('admin') // Remove admin data from localStorage
    } else if (localStorage.getItem('user')) {
      localStorage.removeItem('user') // Remove user data from localStorage
    }

    // Redirect to login page after logout
    navigate('/login')
  }

  return (
    <CButton color="primary" active tabIndex={-1} onClick={handleLogout}>
      <CIcon icon={cilAccountLogout} /> Logout
    </CButton>
  )
}

export default AppHeaderDropdown
