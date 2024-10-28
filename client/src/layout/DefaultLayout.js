import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'  // Import useNavigate for redirection
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()  // Initialize the useNavigate hook for redirection

  // useEffect(() => {
  //   // Check if admin is in localStorage
  //   const admin = localStorage.getItem('admin')

  //   // If no admin is found, redirect to login page
  //   if (!admin) {
  //     navigate('/login')
  //   }
  // }, [navigate])  // Dependency array ensures it runs once after render

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
