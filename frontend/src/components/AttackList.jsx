export default function AttackList({ attacks, onSelectAttack, selectedAttack }) {
  if (!attacks || attacks.length === 0) {
    return (
      <div className="attack-list">
        <h2>🔴 Live Threat Feed</h2>
        <p>No attacks detected</p>
      </div>
    );
  }

  const getAttackBadgeClass = (attackType) => {
    const baseClass = 'attack-badge';
    switch (attackType) {
      case 'DDoS':
        return `${baseClass} badge-ddos`;
      case 'Brute Force':
        return `${baseClass} badge-bruteforce`;
      case 'Port Scan':
        return `${baseClass} badge-portscan`;
      default:
        return `${baseClass} badge-suspicious`;
    }
  };

  // Limit to 20 most recent attacks
  const displayAttacks = attacks.slice(0, 20);

  return (
    <div className="attack-list">
      <h2>🔴 Live Threat Feed</h2>
      <div className="attack-items">
        {displayAttacks.map((attack) => (
          <div
            key={attack.id}
            className={`attack-item ${selectedAttack?.id === attack.id ? 'selected' : ''}`}
            onClick={() => onSelectAttack(attack)}
          >
            <div className="attack-header">
              <span className={getAttackBadgeClass(attack.attackType)}>
                {attack.attackType}
              </span>
              <span className="confidence">{attack.confidence}%</span>
            </div>
            <div className="attack-ip">{attack.ip}</div>
            <div className="attack-location">
              📍 {attack.city}, {attack.country}
            </div>
            <div className="attack-reports">
              📊 {attack.reportCount} reports
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
