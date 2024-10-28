import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'

const ThreatsBargraph = (props) => {
  const widgetChartRefBar = useRef(null)
  const widgetChartRefPie = useRef(null)
  const [threatCounts, setThreatCounts] = useState({
    benign: 0,
    defacement: 0,
    phishing: 0,
    malware: 0,
  });

  // Fetch threats data from API
  const fetchThreatCounts = async () => {
    try {
      const response = await fetch('http://localhost:8000/predictions/counts'); // Update with your API endpoint
      const data = await response.json();
      setThreatCounts(data); // Assuming the API response matches your structure
    } catch (error) {
      console.error('Error fetching threat counts:', error);
    }
  };

  useEffect(() => {
    fetchThreatCounts();
  }, []);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>Threat Distribution</CCardHeader>
          <CCardBody>
            <CChartBar
              ref={widgetChartRefBar}
              style={{ height: '300px' }}
              data={{
                labels: ['Benign', 'Defacement', 'Phishing', 'Malware'],
                datasets: [
                  {
                    label: 'Threats Detected',
                    backgroundColor: getStyle('--cui-primary'),
                    data: [
                      threatCounts.benign,
                      threatCounts.defacement,
                      threatCounts.phishing,
                      threatCounts.malware,
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>Threat Breakdown</CCardHeader>
          <CCardBody>
            <CChartPie
              ref={widgetChartRefPie}
              style={{ height: '300px' }}
              data={{
                labels: ['Benign', 'Defacement', 'Phishing', 'Malware'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [
                      threatCounts.benign,
                      threatCounts.defacement,
                      threatCounts.phishing,
                      threatCounts.malware,
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

ThreatsBargraph.propTypes = {
  className: PropTypes.string,
}

export default ThreatsBargraph
