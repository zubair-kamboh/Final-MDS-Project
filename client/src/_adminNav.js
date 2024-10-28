import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCloudUpload, cilChartLine, cilCheck, cilChartPie, cilUserPlus } from '@coreui/icons';
import { CNavItem } from '@coreui/react';

const _adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
    name: 'Total Scans',
    to: '/total-scans',
    icon: <CIcon icon={cilCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Activity Logs',
    to: '/activity-logs',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/user-management',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Malware Classification',
    to: '/classification',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
];

export default _adminNav;
