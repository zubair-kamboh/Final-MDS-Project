import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cilPencil,
  cilSpeedometer, cilCloudUpload,
  cilStar,
  cilChartLine,
  cilCheck,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  
  {
    component: CNavItem,
    name: 'Upload',
    to: '/upload',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Prediction Results',
    to: '/prediction-results',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'TotalScans',
    to: '/total-scans',
    icon: <CIcon icon={cilCheck} customClassName="nav-icon" />,
  },
 
 

  {
    component: CNavItem,
    name: 'FAQ',
    to: '/FAQ',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
 
  {
    component: CNavItem,
    name: 'User Management',
    to: '/user-management',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
]

export default _nav
