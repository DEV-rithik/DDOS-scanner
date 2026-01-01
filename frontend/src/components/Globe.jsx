import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import './Globe.css';

const ATTACK_COLORS = {
  'DDoS': '#ff4444',
  'Brute Force': '#ff8800',
  'Port Scan': '#ffcc00',
  'Suspicious': '#888888'
};

const TARGET_CITIES = [
  { city: 'New York', lat: 40.7128, lng: -74.0060 },
  { city: 'London', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { city: 'Sydney', lat: -33.8688, lng: 151.2093 }
];

export default function GlobeComponent({ attacks, onSelectAttack, selectedAttack }) {
  const globeEl = useRef();
  const containerRef = useRef();
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || globeReady) return;

    const globe = Globe()
      (containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundColor('#0a0a0a')
      .width(containerRef.current.offsetWidth)
      .height(containerRef.current.offsetHeight);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    globeEl.current = globe;
    setGlobeReady(true);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && globe) {
        globe
          .width(containerRef.current.offsetWidth)
          .height(containerRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!globeReady || !globeEl.current || !attacks) return;

    const globe = globeEl.current;

    // Convert attacks to points
    const points = attacks.map(attack => ({
      lat: attack.latitude,
      lng: attack.longitude,
      size: 0.5,
      color: ATTACK_COLORS[attack.attackType] || '#888888',
      label: `${attack.ip} - ${attack.attackType}`,
      attack: attack
    }));

    // Add points layer
    globe
      .pointsData(points)
      .pointAltitude(0.01)
      .pointRadius('size')
      .pointColor('color')
      .pointLabel('label')
      .onPointClick((point) => {
        if (onSelectAttack && point.attack) {
          onSelectAttack(point.attack);
        }
      });

    // Create arcs from attack sources to random target cities
    const arcs = attacks.slice(0, 20).map((attack, index) => {
      const targetCity = TARGET_CITIES[index % TARGET_CITIES.length];
      return {
        startLat: attack.latitude,
        startLng: attack.longitude,
        endLat: targetCity.lat,
        endLng: targetCity.lng,
        color: [ATTACK_COLORS[attack.attackType] || '#888888', '#ffffff']
      };
    });

    globe
      .arcsData(arcs)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(3000)
      .arcStroke(0.5);

  }, [attacks, globeReady, onSelectAttack]);

  // Highlight selected attack
  useEffect(() => {
    if (!globeReady || !globeEl.current || !selectedAttack) return;

    const globe = globeEl.current;
    
    // Point to the selected attack location
    globe.pointOfView({
      lat: selectedAttack.latitude,
      lng: selectedAttack.longitude,
      altitude: 2
    }, 1000);
  }, [selectedAttack, globeReady]);

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {selectedAttack && (
        <div className="globe-info-panel">
          <div className="info-header">
            <span className="info-icon">🎯</span>
            <span className="info-title">Selected Attack</span>
            <button 
              className="info-close"
              onClick={() => onSelectAttack(null)}
            >
              ✕
            </button>
          </div>
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">IP Address:</span>
              <span className="info-value">{selectedAttack.ip}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className={`info-badge badge-${selectedAttack.attackType.toLowerCase().replace(' ', '')}`}>
                {selectedAttack.attackType}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">{selectedAttack.city}, {selectedAttack.country}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Confidence:</span>
              <span className="info-value confidence-value">{selectedAttack.confidence}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
