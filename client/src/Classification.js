import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Classification = () => {
  const data = {
    labels: ['Benign', 'Malware', 'Phishing', 'Defacement'],
    datasets: [
      {
        label: 'Total URLs',
        data: [428103, 32520, 41111, 96457],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Classification of URLs',
      },
    },
  };

  return (
    <div>
      <h1>URL Classification Statistics</h1>
      <Bar data={data} options={options} />
      <h2>Key Findings:</h2>
      <ul>
        <li>Benign URLs: 428,103</li>
        <li>Malware URLs: 32,520</li>
        <li>Phishing URLs: 41,111 (Median Length: 500 characters)</li>
        <li>Defacement URLs: 96,457</li>
      </ul>
      <h2>Model Performance:</h2>
      <p>Accuracy: 0.9344</p>
      <p>Performance Summary:</p>
      <ul>
        <li>Benign: High precision (0.95) and recall (0.97).</li>
        <li>Defacement: High precision and recall, both at 0.97.</li>
        <li>Malware: Slightly lower precision and recall at 0.94.</li>
        <li>Phishing: Lower precision (0.83) and recall (0.74), indicating the model struggles more with phishing URLs.</li>
      </ul>
    </div>
  );
};

export default Classification;
