import { useState, useEffect } from 'react';
import SOSButton from './SOSButton';

const GlobalSOS = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // Default to Naga City center if geolocation fails
          setUserLocation({ lat: 13.6192, lon: 123.1814 });
        }
      );
    } else {
      setUserLocation({ lat: 13.6192, lon: 123.1814 });
    }
  }, []);

  const handleEmergencyReport = (reportData) => {
    console.log('Emergency Report Submitted:', reportData);
    
    // Store in localStorage to simulate backend (for admin panel to see)
    const existingAlerts = JSON.parse(localStorage.getItem('medmap_emergency_alerts') || '[]');
    const updatedAlerts = [reportData, ...existingAlerts].slice(0, 10); // Keep last 10
    localStorage.setItem('medmap_emergency_alerts', JSON.stringify(updatedAlerts));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('emergencyAlert', { detail: updatedAlerts }));
    
    // In a real app, this would send to backend/API
    // Could also show a notification or toast
  };

  return <SOSButton userLocation={userLocation} onEmergencyReport={handleEmergencyReport} />;
};

export default GlobalSOS;

