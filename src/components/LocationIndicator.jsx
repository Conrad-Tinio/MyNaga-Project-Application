import { MapPin, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';

const LocationIndicator = ({ userLocation, onLocationUpdate }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
          setIsLocating(false);
        },
        (error) => {
          setLocationError('Unable to get your location. Using default Naga City location.');
          setIsLocating(false);
          // Fallback to Naga City center
          if (onLocationUpdate) {
            onLocationUpdate({ lat: 13.6192, lon: 123.1814 });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!userLocation) {
      requestLocation();
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800">Location not available</span>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
        >
          {isLocating ? 'Locating...' : 'Enable Location'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 rounded-full p-1.5">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">Your Location</p>
            <p className="text-xs text-green-700">
              {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </p>
          </div>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="text-xs text-green-700 hover:text-green-900 font-medium disabled:opacity-50 flex items-center space-x-1"
          title="Refresh location"
        >
          {isLocating ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3" />
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>
      {locationError && (
        <p className="text-xs text-yellow-700 mt-2">{locationError}</p>
      )}
    </div>
  );
};

export default LocationIndicator;

