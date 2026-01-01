import { useEffect, useState } from 'react';
import './ToggleSwitch.css';

export default function ToggleSwitch({ onChange }) {
  const [selected, setSelected] = useState(() => {
    // Load from localStorage or default to '7days'
    try {
      return localStorage.getItem('timePeriod') || '7days';
    } catch (e) {
      console.warn('localStorage not available:', e);
      return '7days';
    }
  });
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    // Persist to localStorage whenever it changes
    try {
      localStorage.setItem('timePeriod', selected);
    } catch (e) {
      console.warn('localStorage.setItem failed:', e);
    }
  }, [selected]);

  useEffect(() => {
    // Skip the initial call to avoid unnecessary render on mount
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    // Notify parent component only when selected changes after mount
    onChange(selected);
  }, [selected, onChange, isInitialMount]);

  return (
    <div className="toggle-switch-container">
      <label className="toggle-label">Time Period:</label>
      <div className="toggle-switch">
        <button
          className={`toggle-option ${selected === '1hour' ? 'active' : ''}`}
          onClick={() => setSelected('1hour')}
        >
          ⏱️ Last 1 Hour
        </button>
        <button
          className={`toggle-option ${selected === '7days' ? 'active' : ''}`}
          onClick={() => setSelected('7days')}
        >
          📅 Last 7 Days
        </button>
        <div className={`toggle-slider ${selected === '1hour' ? 'left' : 'right'}`} />
      </div>
    </div>
  );
}
