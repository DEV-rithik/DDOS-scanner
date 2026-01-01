import { useState, useEffect, useMemo, useCallback } from 'react';
import Globe from './components/Globe';
import Dashboard from './components/Dashboard';
import AttackList from './components/AttackList';
import ToggleSwitch from './components/ToggleSwitch';
import { fetchAttacks, fetchStats } from './services/api';
import './App.css';

// Time period constants in milliseconds
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState(() => {
    return localStorage.getItem('timePeriod') || '7days';
  });

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

  // Filter attacks based on time period
  const filteredAttacks = useMemo(() => {
    if (!attacks || attacks.length === 0) return [];
    
    const now = new Date();
    const cutoffTime = timePeriod === '1hour' 
      ? new Date(now.getTime() - MILLISECONDS_PER_HOUR)
      : new Date(now.getTime() - 7 * MILLISECONDS_PER_DAY);

    return attacks.filter(attack => {
      // If attack has timestamp, use it; otherwise include all attacks
      if (attack.timestamp) {
        const attackTime = new Date(attack.timestamp);
        return attackTime >= cutoffTime;
      }
      return true;
    });
  }, [attacks, timePeriod]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    if (!stats || !filteredAttacks) return stats;

    // Count attacks by protocol
    const attacksByProtocol = {};
    const countryCounts = {};

    filteredAttacks.forEach(attack => {
      // Count protocols
      const protocol = attack.attackType || 'Unknown';
      attacksByProtocol[protocol] = (attacksByProtocol[protocol] || 0) + 1;

      // Count countries
      const country = attack.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    // Create top source countries array
    const topSourceCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalAttacks: filteredAttacks.length,
      attacksByProtocol,
      topSourceCountries,
      topTargetCountries: stats.topTargetCountries || []
    };
  }, [filteredAttacks, stats]);

  // Load data on mount and set up auto-refresh
  useEffect(() => {
    loadData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Memoize the time period change handler
  const handleTimePeriodChange = useCallback((newPeriod) => {
    setTimePeriod(newPeriod);
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
        <div className="header-content">
          <div className="header-left">
            <h1>🌐 DDoS Attack Tracker</h1>
            <p>Real-time cyber threat visualization</p>
          </div>
          <button onClick={loadData} className="refresh-button" title="Refresh data">
            🔄 Refresh
          </button>
        </div>
        <ToggleSwitch value={timePeriod} onChange={handleTimePeriodChange} />
      </header>

      <main className="app-main">
        <div className="globe-container">
          <Globe
            attacks={filteredAttacks}
            onSelectAttack={setSelectedAttack}
            selectedAttack={selectedAttack}
          />
        </div>

        <div className="sidebar">
          <Dashboard stats={filteredStats} timePeriod={timePeriod} />
          <AttackList
            attacks={filteredAttacks}
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
