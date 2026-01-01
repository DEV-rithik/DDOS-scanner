import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ stats, timePeriod }) {
  if (!stats) {
    return (
      <div className="dashboard">
        <p>Loading statistics...</p>
      </div>
    );
  }

  const periodLabel = timePeriod === '1hour' ? 'Last Hour' : 'Last 7 Days';

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
          '#44ff44',
          '#4488ff',
          '#aa44ff'
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
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ff4444',
        borderWidth: 1,
        padding: 12,
        displayColors: true
      }
    }
  };

  // Calculate additional stats
  const uniqueCountries = (stats.topSourceCountries || []).length;
  const avgConfidence = stats.averageConfidence || 0;

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-card-icon">🔴</span>
          <h3>Total Attacks</h3>
          <div className="stat-number">{(stats.totalAttacks || 0).toLocaleString()}</div>
          <p className="stat-period">{periodLabel}</p>
        </div>

        <div className="stat-card">
          <span className="stat-card-icon">🌍</span>
          <h3>Countries</h3>
          <div className="stat-number">{uniqueCountries}</div>
          <p className="stat-period">Source Nations</p>
        </div>

        <div className="stat-card">
          <span className="stat-card-icon">🎯</span>
          <h3>Attack Types</h3>
          <div className="stat-number">{Object.keys(stats.attacksByProtocol || {}).length}</div>
          <p className="stat-period">Categories</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>🔬 Attacks by Type</h3>
        <div style={{ height: '220px', padding: '1rem 0' }}>
          <Doughnut data={protocolData} options={protocolOptions} />
        </div>
      </div>

      <div className="severity-legend">
        <h3>⚠️ Severity Levels</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff4444' }}></span>
            <span>Critical - DDoS</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff8800' }}></span>
            <span>High - Brute Force</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ffcc00' }}></span>
            <span>Medium - Port Scan</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#888888' }}></span>
            <span>Low - Suspicious</span>
          </div>
        </div>
      </div>
    </div>
  );
}
