import React, { useEffect, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
console.log(logs)
  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('http://localhost:8000/activity-logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  return (
    <div>
      <h2>Activity Log</h2>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>User ID</CTableHeaderCell>
            <CTableHeaderCell>User Type</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Timestamp</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {logs.map((log, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{log.userId}</CTableDataCell>
              <CTableDataCell>{log.userType}</CTableDataCell>
              <CTableDataCell>{log.action}</CTableDataCell>
              <CTableDataCell>{log.description}</CTableDataCell>
              <CTableDataCell>{new Date(log.timestamp).toLocaleString()}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ActivityLogs;
