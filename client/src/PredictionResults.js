import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import WidgetsDropdown from './views/widgets/WidgetsDropdown';
import ThreatsDetectedChart from './ThreatsDetectedChart';
import ThreatsBargraph from './ThreatsBargraph';

const PredictionResults = () => {
  const [userStats, setUserStats] = useState([]); // State to store user stats
  // Fetch user stats from the API
  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/stats'); // Update with your actual endpoint
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchUserStats(); // Fetch user stats when the component mounts
  }, []);

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <ThreatsDetectedChart />
      <ThreatsBargraph />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Prediction Results</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Total Scanns</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Threats Detected</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Registered</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userStats.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div>{item.username}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.userType}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.totalScans}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.threatsDetected}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{new Date(item.registered).toLocaleDateString()}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default PredictionResults;
