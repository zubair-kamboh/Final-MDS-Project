import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCloudUpload, cilChartLine } from '@coreui/icons';
import { CNavItem } from '@coreui/react';

const _userNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/user-dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Prediction Results',
    to: '/user-prediction-results',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'FAQ',
    to: '/faq',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Feedback',
    to: '/feedback',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Training And Resources',
    to: '/training-and-resources',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Malware Types',
    to: '/malware-types',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
];

export default _userNav;
