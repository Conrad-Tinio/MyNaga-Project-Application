import StatusBadge from './StatusBadge';
import { MapPin, Phone, Clock } from 'lucide-react';
import { calculateDistance } from '../data/mockData';

const ResourceCard = ({ resource, facility, availability, userLocation, showDetails = false, onClick }) => {
  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lon, facility.latitude, facility.longitude)
    : null;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const facilityTypeLabels = {
    hospital: 'Hospital',
    infirmary: 'Infirmary',
    health_center: 'Health Center',
    pharmacy: 'Pharmacy'
  };

  return (
    <div 
      className="card-modern p-5 group cursor-pointer hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-600 transition-all duration-200"
      onClick={() => onClick && onClick(facility)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(facility);
        }
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200">
            {facility.name}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{facilityTypeLabels[facility.type]}</p>
        </div>
        <StatusBadge status={availability.status} />
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-start text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary-500 dark:text-primary-400" />
          <span className="leading-relaxed">{facility.address}</span>
        </div>
        {distance !== null && (
          <div className="flex items-center text-sm">
            <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-lg font-semibold">
              📍 {distance.toFixed(1)} km away
            </div>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Phone className="w-4 h-4 mr-2 text-primary-500 dark:text-primary-400" />
          <span className="font-medium">{facility.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>Updated {formatTimeAgo(availability.lastUpdated)}</span>
        </div>
      </div>

      {showDetails && availability.stock !== undefined && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Level:</span>
            <span className="text-sm font-bold text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
              {availability.stock} units
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;



