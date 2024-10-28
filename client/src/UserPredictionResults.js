import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol
} from '@coreui/react';
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPredictionResults = () => {
  const [predictionsData, setPredictionsData] = useState([]); // Store all user predictions
  const [loading, setLoading] = useState(false); // Handle loading state

  // Fetch the user's prediction history on component mount
  useEffect(() => {
    fetchUserPredictions();
  }, []);

  const fetchUserPredictions = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await fetch(`http://localhost:8000/predictions/${user._id}`);
      const data = await response.json();

      if (response.ok) {
        setPredictionsData(data || []);
      } else {
        toast.error('Failed to load prediction results.');
      }
    } catch (error) {
      console.error('Error fetching user predictions:', error);
      toast.error('An error occurred while fetching predictions.');
    }
    setLoading(false);
  };

  // Calculate statistics
  const totalPredictions = predictionsData.reduce((acc, curr) => acc + curr.predictions.length, 0);
  const virusDetected = predictionsData.reduce(
    (acc, curr) => acc + curr.predictions.filter(p => p.prediction !== 'benign').length,
    0
  );
  const noVirusDetected = totalPredictions - virusDetected;

  // Group predictions by date
  const predictionsByDate = predictionsData.reduce((acc, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString();
    acc[date] = acc[date] ? acc[date] + curr.predictions.length : curr.predictions.length;
    return acc;
  }, {});

  // Chart data for malware vs. no malware
  const malwareChartData = {
    labels: ['No Virus', 'Virus Detected'],
    datasets: [
      {
        data: [noVirusDetected, virusDetected],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Chart data for predictions by date
  const predictionCountsByDate = Object.values(predictionsByDate);
  const predictionLabels = Object.keys(predictionsByDate);

  const predictionsByDateChartData = {
    labels: predictionLabels,
    datasets: [
      {
        label: 'Predictions by Date',
        backgroundColor: '#4BC0C0',
        data: predictionCountsByDate,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Prediction Results</h1>
      
      {loading && <p>Loading prediction results...</p>}

      {/* Summary Section */}
      <CCard className="mb-4">
        <CCardHeader>Summary</CCardHeader>
        <CCardBody>
          <p><strong>Total Predictions:</strong> {totalPredictions}</p>
          <p><strong>Virus Detected:</strong> {virusDetected}</p>
          <p><strong>No Virus Detected:</strong> {noVirusDetected}</p>
        </CCardBody>
      </CCard>

      {/* Prediction Results Table */}
      <CCard className="mb-4">
        <CCardHeader>Prediction Details</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>URL</CTableHeaderCell>
                <CTableHeaderCell>Prediction</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Time</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {predictionsData.map((entry, index) => (
                entry.predictions.map((prediction, subIndex) => (
                  <CTableRow key={`${index}-${subIndex}`}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{prediction.url}</CTableDataCell>
                    <CTableDataCell>{prediction.prediction}</CTableDataCell>
                    <CTableDataCell>{new Date(entry.createdAt).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>{new Date(entry.createdAt).toLocaleTimeString()}</CTableDataCell>
                  </CTableRow>
                ))
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Charts Section */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Malware vs. No Malware</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={malwareChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
                style={{ height: '400px' }} // Increase the chart size
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Predictions by Date</CCardHeader>
            <CCardBody>
              <CChartBar
                data={predictionsByDateChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
                style={{ height: '400px' }} // Increase the chart size
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default UserPredictionResults;
