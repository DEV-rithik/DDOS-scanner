import { useState, useEffect, useCallback } from 'react';
import Globe from './components/Globe';
import Dashboard from './components/Dashboard';
import AttackList from './components/AttackList';
import ToggleSwitch from './components/ToggleSwitch';
import { fetchAttacks, fetchStats } from './services/api';
import './App.css';

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState('7days');
  const [allAttacks, setAllAttacks] = useState([]);
  const [allStats, setAllStats] = useState(null);

  // Filter attacks based on time period
  const filterAttacksByTimePeriod = useCallback((attacksData, period) => {
    const now = new Date();
    const cutoffTime = period === '1hour' 
      ? new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    return attacksData.filter(attack => {
      const attackTime = new Date(attack.lastReportedAt || attack.timestamp || now);
      return attackTime >= cutoffTime;
    });
  }, []);

  // Calculate filtered stats
  const calculateStats = useCallback((attacksData) => {
    const attacksByProtocol = {};
    const countryCounts = {};
    
    attacksData.forEach(attack => {
      // Count by attack type
      const type = attack.attackType || 'Unknown';
      attacksByProtocol[type] = (attacksByProtocol[type] || 0) + 1;
      
      // Count by country
      const country = attack.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    // Get top source countries
    const topSourceCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalAttacks: attacksData.length,
      attacksByProtocol,
      topSourceCountries,
    };
  }, []);

  // Apply filters and update state
  const applyFilters = useCallback((attacksData, period) => {
    const filteredAttacks = filterAttacksByTimePeriod(attacksData, period);
    setAttacks(filteredAttacks);
    setStats(calculateStats(filteredAttacks));
  }, [filterAttacksByTimePeriod, calculateStats]);

  // Fetch data from backend
  const loadData = async () => {
    try {
      setError(null);
      const [attacksData, statsData] = await Promise.all([
        fetchAttacks(),
        fetchStats()
      ]);
      setAllAttacks(attacksData);
      setAllStats(statsData);
      
      // Apply time filter
      applyFilters(attacksData, timePeriod);
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

  // Re-filter when time period changes
  useEffect(() => {
    if (allAttacks.length > 0) {
      applyFilters(allAttacks, timePeriod);
    }
  }, [timePeriod, allAttacks, applyFilters]);

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
          <div className="header-right">
            <button onClick={loadData} className="refresh-button" title="Refresh Data">
              🔄 Refresh
            </button>
          </div>
        </div>
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
          <ToggleSwitch onChange={handleTimePeriodChange} />
          <Dashboard stats={stats} timePeriod={timePeriod} />
          <AttackList
            attacks={attacks}
            onSelectAttack={setSelectedAttack}
            selectedAttack={selectedAttack}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          📊 Data sources: AbuseIPDB & Cloudflare Radar | 
          🕒 Last updated: {new Date().toLocaleTimeString()} | 
          ⏱️ Showing: {timePeriod === '1hour' ? 'Last 1 Hour' : 'Last 7 Days'}
        </p>
      </footer>
    </div>
  );
}

export default App;
