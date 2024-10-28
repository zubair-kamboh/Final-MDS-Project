import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol
} from '@coreui/react';
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'reactstrap'; // Import spinner from reactstrap

// Function to truncate URL if it exceeds 60 characters
const truncateUrl = (url) => {
  if (url.length > 60) {
    return url.slice(0, 60) + '...'; // Truncate and add ellipsis
  }
  return url; // Return the original URL if it's within the limit
};

const UserDashboard = () => {
  const [url, setUrl] = useState(''); // State for URL input
  const [predictions, setPredictions] = useState([]); // State to store the prediction results
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const handleAnalyzeUrl = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true); // Show the spinner
    const jsonOutput = { urls: [url] }; // Send a single URL for detection

    try {
      const response = await fetch('http://127.0.0.1:8000/gb_dt_model/detect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonOutput),
      });

      const data = await response.json();

      if (response.ok) {
        const predictionsArray = data.map((prediction) => ({
          url: prediction.url,
          prediction: prediction.prediction,
        }));

        setPredictions(predictionsArray);
        toast.success('Prediction received successfully!'); // Success toast

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user._id;
        const userType = user.role;

        const expressOutput = {
          predictions: predictionsArray,
          userId: userId,
          userType: userType,
        };

        const expressResponse = await fetch('http://localhost:8000/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expressOutput),
        });

        if (expressResponse.ok) {
          toast.success('Prediction saved to the database successfully!');
        } else {
          const expressData = await expressResponse.json();
          toast.error(`Error saving prediction: ${expressData.detail}`);
        }
      } else {
        toast.error(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error processing prediction:', error);
      toast.error('Failed to process the prediction. Please try again later.');
    } finally {
      setLoading(false); // Hide the spinner
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Filter predictions based on search query
  const filteredPredictions = predictions.filter((prediction) =>
    prediction.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPrediction = currentPage * itemsPerPage;
  const indexOfFirstPrediction = indexOfLastPrediction - itemsPerPage;
  const currentPredictions = filteredPredictions.slice(indexOfFirstPrediction, indexOfLastPrediction);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);

  // Chart data based on predictions
  const predictionCounts = predictions.reduce((acc, prediction) => {
    acc[prediction.prediction] = (acc[prediction.prediction] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', borderRadius: '8px' }}>
      <ToastContainer /> {/* Toast notifications container */}
      <h1 style={{ marginBottom: '20px' }}>URL Analysis</h1>

      <CFormInput
        type="text"
        placeholder="Enter a URL for analysis"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <CButton color="primary" onClick={handleAnalyzeUrl} className="submit" style={{ marginBottom: '20px' }} disabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Analyze URL'}
      </CButton>

      {predictions.length > 0 && (
        <>
          <h1 style={{ marginBottom: '20px' }}>Prediction Results: </h1>

          <CFormInput
            type="text"
            placeholder="Search by URL"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: '20px' }}
          />

          <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <CTable>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">URL</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Prediction</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentPredictions.map((prediction, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{index + 1 + indexOfFirstPrediction}</CTableHeaderCell>
                    <CTableDataCell style={{ whiteSpace: 'normal' }}>
                      {truncateUrl(prediction.url)}
                    </CTableDataCell>
                    <CTableDataCell style={{ whiteSpace: 'normal' }}>
                      {prediction.prediction}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>

          <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <CButton
              color="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </CButton>

            <div>
              {Array.from({ length: Math.min(10, totalPages) }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <CButton
                    key={pageNumber}
                    color={currentPage === pageNumber ? 'dark' : 'secondary'}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{ margin: '0 5px', fontWeight: currentPage === pageNumber ? 'bold' : 'normal' }}
                  >
                    {pageNumber}
                  </CButton>
                );
              })}
            </div>

            <CButton
              color="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </CButton>
          </div>

          <CRow style={{ marginTop: '50px' }}>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Prediction Distribution</CCardHeader>
                <CCardBody>
                  <CChartDoughnut
                    data={{
                      labels: Object.keys(predictionCounts),
                      datasets: [
                        {
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                          data: Object.values(predictionCounts),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Prediction Count</CCardHeader>
                <CCardBody>
                  <CChartBar
                    data={{
                      labels: Object.keys(predictionCounts),
                      datasets: [
                        {
                          label: 'Count',
                          backgroundColor: '#36A2EB',
                          data: Object.values(predictionCounts),
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
