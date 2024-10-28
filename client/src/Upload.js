import React, { useState } from 'react';
import Papa from 'papaparse'; // Import the papaparse library
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
import { useDropzone } from 'react-dropzone'; // Import useDropzone from react-dropzone
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

const Upload = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]); // State to store the prediction results
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Set the first dropped file
    }
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true); // Show the spinner
      // Read the CSV file using PapaParse
      Papa.parse(file, {
        header: false,
        complete: async (results) => {
          const urls = results.data.map((row) => row[0]).filter((url) => url);

          const jsonOutput = {
            urls: urls,
          };

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
              toast.success('Analyzing.....'); // Success toast

              const user = JSON.parse(localStorage.getItem('admin'));
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
                toast.success('Predictions Results saved to the Database!');
              } else {
                const expressData = await expressResponse.json();
                toast.error(`Error saving predictions: ${expressData.detail}`);
              }
            } else {
              toast.error(`Error: ${data.detail}`);
            }
          } catch (error) {
            console.error('Error processing predictions:', error);
            toast.error('Failed to process the predictions. Please try again later.');
          } finally {
            setLoading(false); // Hide the spinner
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse the CSV file.');
          setLoading(false); // Hide the spinner on error
        },
      });
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

  // Use the dropzone for drag-and-drop functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  // Chart data based on predictions
  const predictionCounts = predictions.reduce((acc, prediction) => {
    acc[prediction.prediction] = (acc[prediction.prediction] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', borderRadius: '8px' }}>
      <ToastContainer /> {/* Toast notifications container */}
      <h1 style={{ fontSize: '30px', textAlign: 'center', marginBottom: '15px' }}>This component uses a Gradient Boosting + Decision Tree algorithm hybrid model.</h1>
      <div {...getRootProps({ className: 'dropzone', style: { border: '2px dashed #592A8A', borderRadius: '5px', padding: '20px', marginBottom: '20px', textAlign: 'center', backgroundColor: isDragActive ? '#f0f0f0' : '#ffffff' } })}>
        <input {...getInputProps()} />
        {file ? (
          <p style={{ margin: 0, color: 'black' }}>File ready to upload: {file.name}</p>
        ) : (
          <p style={{ margin: 0, color: 'black' }}>Drag & drop your CSV file here, or click to select one</p>
        )}
      </div>

      {file && (
        <CButton color="primary" onClick={handleUpload} className="submit" style={{ marginBottom: '20px' }}>
          Upload a file
        </CButton>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Spinner color="primary" /> {/* Loading spinner */}
        </div>
      )}

      {predictions.length > 0 && (  // Only show search and pagination if predictions are available
        <>
          <h1 style={{ marginBottom: '20px' }}>Prediction Results: </h1>

          {/* Search Bar */}
          <CFormInput
            type="text"
            placeholder="Search by URL"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: '20px' }}
          />

          {/* Wrap the table in a container for styling */}
          <div
            style={{
              maxWidth: '100%',
              overflowX: 'auto', // Enable horizontal scrolling if necessary
            }}
          >
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
                      {truncateUrl(prediction.url)} {/* Truncate the URL */}
                    </CTableDataCell>
                    <CTableDataCell style={{ whiteSpace: 'normal' }}>
                      {prediction.prediction}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination Controls */}
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
                const pageNumber = index + 1; // Page number starts from 1
                return (
                  <CButton
                    key={pageNumber}
                    color={currentPage === pageNumber ? 'dark' : 'secondary'} // Change color if active
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{ margin: '0 5px', fontWeight: currentPage === pageNumber ? 'bold' : 'normal' }} // Highlight active page
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

          {/* Charts Section */}
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

export default Upload;
