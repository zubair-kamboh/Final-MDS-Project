import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CButton,
  CButtonGroup,
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import MainChart from './views/dashboard/MainChart'; // Ensure this points to your chart component
import classNames from 'classnames';

// Example data structure
const progressExample = [
  { title: 'Benign', color: 'success', value: 0, percent: 0 },
  { title: 'Defacement', color: 'info', value: 0, percent: 0 },
  { title: 'Phishing', color: 'warning', value: 0, percent: 0 },
  { title: 'Malware', color: 'danger', value: 0, percent: 0 },
];

const ThreatsDetected = () => {
  const [threats, setThreats] = useState(progressExample);

  // Fetch threats detected from the API
  const fetchThreats = async () => {
    try {
      const response = await fetch('http://localhost:8000/predictions/counts'); // Update with the correct endpoint
      const data = await response.json();

      // Calculate total count from the fetched data
      const totalCount = Object.values(data).reduce((acc, count) => acc + count, 0);

      // Update the state based on the fetched data
      const updatedThreats = threats.map((threat) => {
        const threatCount = data[threat.title.toLowerCase()] || 0; // Get the count for the specific threat
        return {
          ...threat,
          value: threatCount, // Set value based on fetched data
          percent: totalCount > 0 ? ((threatCount / totalCount) * 100).toFixed(2) : 0, // Calculate percentage
        };
      });

      setThreats(updatedThreats);
    } catch (error) {
      console.error('Error fetching threats:', error);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CRow>
          <CCol sm={5}>
            <h4 id="traffic" className="card-title mb-0">
              Threats Detected
            </h4>
            <div className="small text-body-secondary">Oct 2024</div>
          </CCol>
          <CCol sm={7} className="d-none d-md-block">
            <CButton color="primary" className="float-end">
              <CIcon icon={cilCloudDownload} />
            </CButton>
            <CButtonGroup className="float-end me-3">
              {['Day', 'Month', 'Year'].map((value) => (
                <CButton
                  color="outline-secondary"
                  key={value}
                  className="mx-0"
                  active={value === 'Month'} // Change active button based on your logic
                >
                  {value}
                </CButton>
              ))}
            </CButtonGroup>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          sm={{ cols: 2 }}
          lg={{ cols: 4 }}
          xl={{ cols: 5 }}
          className="mb-2 text-center"
        >
          {threats.map((item, index) => (
            <CCol
              className={classNames({
                'd-none d-xl-block': index + 1 === threats.length,
              })}
              key={index}
            >
              <div className="text-body-secondary">{item.title}</div>
              <div className="fw-semibold text-truncate">
                {item.value} ({item.percent}%)
              </div>
              <CProgress thin className="mt-2" color={item.color} value={item.percent} />
            </CCol>
          ))}
        </CRow>
      </CCardFooter>
    </CCard>
  );
};

export default ThreatsDetected;
