import { useEffect, useState } from 'react';
import './ToggleSwitch.css';

export default function ToggleSwitch({ onChange }) {
  const [selected, setSelected] = useState(() => {
    // Load from localStorage or default to '7days'
    return localStorage.getItem('timePeriod') || '7days';
  });

  useEffect(() => {
    // Persist to localStorage whenever it changes
    localStorage.setItem('timePeriod', selected);
    // Notify parent component
    onChange(selected);
  }, [selected, onChange]);

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
