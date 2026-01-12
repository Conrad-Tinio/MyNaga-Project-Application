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
      <div className="glass bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/40 rounded-xl p-4 flex items-center justify-between animate-fade-in backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Location not available</span>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="btn-secondary text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isLocating ? 'Locating...' : 'Enable Location'}
        </button>
      </div>
    );
  }

  return (
    <div className="glass bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/40 rounded-xl p-4 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 shadow-md">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-900 dark:text-green-200">Your Location</p>
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
              {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </p>
          </div>
        </div>
        <button
          onClick={requestLocation}
          disabled={isLocating}
          className="text-xs text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-200 font-semibold disabled:opacity-50 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          title="Refresh location"
        >
          {isLocating ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
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
        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">{locationError}</p>
      )}
    </div>
  );
};

export default LocationIndicator;

