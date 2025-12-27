import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="dashboard">
        <p>Loading statistics...</p>
      </div>
    );
  }

  // Prepare data for protocol chart (Doughnut)
  const protocolData = {
    labels: Object.keys(stats.attacksByProtocol || {}),
    datasets: [
      {
        data: Object.values(stats.attacksByProtocol || {}),
        backgroundColor: [
          '#ff4444',
          '#ff8800',
          '#ffcc00',
          '#44ff44'
        ],
        borderColor: '#1a1a2e',
        borderWidth: 2
      }
    ]
  };

  const protocolOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ff4444',
        borderWidth: 1
      }
    }
  };

  // Prepare data for source countries chart (Bar)
  const sourceCountriesData = {
    labels: (stats.topSourceCountries || []).map(c => c.country),
    datasets: [
      {
        label: 'Attack Count',
        data: (stats.topSourceCountries || []).map(c => c.count),
        backgroundColor: '#ff4444',
        borderColor: '#ff6666',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ff4444',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: '#333333'
        }
      },
      y: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: '#333333'
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      
      <div className="stat-card">
        <h3>Total Attacks (7 days)</h3>
        <div className="stat-number">{(stats.totalAttacks || 0).toLocaleString()}</div>
      </div>

      <div className="chart-container">
        <h3>Attacks by Protocol</h3>
        <div style={{ height: '200px' }}>
          <Doughnut data={protocolData} options={protocolOptions} />
        </div>
      </div>

      <div className="chart-container">
        <h3>Top Attack Sources</h3>
        <div style={{ height: '250px' }}>
          <Bar data={sourceCountriesData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
