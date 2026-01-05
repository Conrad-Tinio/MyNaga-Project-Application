import StatusBadge from './StatusBadge';
import { MapPin, Phone, Clock } from 'lucide-react';
import { calculateDistance } from '../data/mockData';

const ResourceCard = ({ resource, facility, availability, userLocation, showDetails = false }) => {
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
          <p className="text-sm text-gray-600">{facilityTypeLabels[facility.type]}</p>
        </div>
        <StatusBadge status={availability.status} />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{facility.address}</span>
        </div>
        {distance !== null && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{distance.toFixed(1)} km away</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{facility.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-2" />
          <span>Updated {formatTimeAgo(availability.lastUpdated)}</span>
        </div>
      </div>

      {showDetails && availability.stock !== undefined && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock Level:</span>
            <span className="font-semibold text-gray-900">{availability.stock} units</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;



