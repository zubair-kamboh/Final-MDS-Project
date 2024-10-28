import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
} from '@coreui/react';
import { CChartDoughnut, CChartBar, CChartLine } from '@coreui/react-chartjs';
import { toast } from 'react-toastify';

const TotalScans = () => {
  const [scanData, setScanData] = useState(null); // State to hold scan data

  // Fetch total scans data from the server
  const fetchScanData = async () => {
    try {
      const response = await fetch('http://localhost:8000/totalscans'); // Adjust the endpoint as necessary
      const data = await response.json();
      
      if (response.ok) {
        setScanData(data); // Set the scan data to state
      } else {
        toast.error(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error fetching scan data:', error);
      toast.error('Failed to fetch scan data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchScanData(); // Call fetch on component mount
  }, []);

  return (
    <div style={{ padding: '20px', borderRadius: '8px' }}>
      <h1>Total Scans</h1>
      {scanData && (
        <>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Total Threats Detected</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: scanData.scans.map(scan => scan.username),
                      datasets: [
                        {
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                          data: scanData.scans.map(scan => scan.threatsDetected),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Total Scans by User</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: scanData.scans.map(scan => scan.username),
                      datasets: [
                        {
                          label: 'Total Scans',
                          backgroundColor: '#36A2EB',
                          data: scanData.scans.map(scan => scan.totalScans),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Scans Over Time</CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: scanData.scans.map(scan => scan.username), // Assuming usernames are your x-axis labels
                      datasets: [
                        {
                          label: 'Scans',
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          data: scanData.scans.map(scan => scan.totalScans), // Adjust according to the time data
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Users',
                          },
                        },
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Scans',
                          },
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Additional Stats */}
          <h4>Total Threats: {scanData.totalThreats}</h4>
          {scanData.scans.map((scan, index) => (
            <div key={index}>
              <p>
                {scan.username} has scanned {scan.totalScans} URLs, detected {scan.threatsDetected} threats.
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TotalScans;
