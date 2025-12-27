import { useState, useEffect } from 'react';
import Globe from './components/Globe';
import Dashboard from './components/Dashboard';
import AttackList from './components/AttackList';
import { fetchAttacks, fetchStats } from './services/api';
import './App.css';

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const loadData = async () => {
    try {
      setError(null);
      const [attacksData, statsData] = await Promise.all([
        fetchAttacks(),
        fetchStats()
      ]);
      setAttacks(attacksData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to connect to backend. Please ensure the server is running on port 3001.');
      setLoading(false);
    }
  };

  // Load data on mount and set up auto-refresh
  useEffect(() => {
    loadData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading DDoS Attack Tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-button">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌐 DDoS Attack Tracker</h1>
        <p>Real-time cyber threat visualization</p>
      </header>

      <main className="app-main">
        <div className="globe-container">
          <Globe
            attacks={attacks}
            onSelectAttack={setSelectedAttack}
            selectedAttack={selectedAttack}
          />
        </div>

        <div className="sidebar">
          <Dashboard stats={stats} />
          <AttackList
            attacks={attacks}
            onSelectAttack={setSelectedAttack}
            selectedAttack={selectedAttack}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Data sources: AbuseIPDB & Cloudflare Radar | Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}

export default App;
