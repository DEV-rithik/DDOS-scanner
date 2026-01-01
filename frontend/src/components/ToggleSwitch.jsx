import { useEffect, useRef } from 'react';
import './ToggleSwitch.css';

export default function ToggleSwitch({ value, onChange }) {
  const isFirstMount = useRef(true);

  // Load saved preference on mount only
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const savedPeriod = localStorage.getItem('timePeriod');
      if (savedPeriod && savedPeriod !== value) {
        onChange(savedPeriod);
      }
    }
  }, [value, onChange]); // onChange is now memoized in parent

  const handleToggle = (newValue) => {
    onChange(newValue);
    localStorage.setItem('timePeriod', newValue);
  };

  return (
    <div className="toggle-switch-container">
      <label className="toggle-label">Time Period:</label>
      <div className="toggle-switch">
        <button
          className={`toggle-option ${value === '1hour' ? 'active' : ''}`}
          onClick={() => handleToggle('1hour')}
        >
          <span className="toggle-icon">⏱️</span>
          Last 1 Hour
        </button>
        <button
          className={`toggle-option ${value === '7days' ? 'active' : ''}`}
          onClick={() => handleToggle('7days')}
        >
          <span className="toggle-icon">📅</span>
          Last 7 Days
        </button>
        <div className={`toggle-slider ${value === '7days' ? 'right' : ''}`} />
      </div>
    </div>
  );
}
