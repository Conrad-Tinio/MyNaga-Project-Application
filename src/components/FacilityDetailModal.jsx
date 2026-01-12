import { useState, useEffect } from 'react';
import { X, MapPin, Phone, Clock, Building2, Pill, Droplet, Bed, Activity } from 'lucide-react';
import { getResourceAvailability, calculateDistance, resourceCategories } from '../data/mockData';
import StatusBadge from './StatusBadge';

const FacilityDetailModal = ({ isOpen, onClose, facility, userLocation }) => {
  const [resources, setResources] = useState([]);
  const [groupedResources, setGroupedResources] = useState({});

  useEffect(() => {
    if (isOpen && facility) {
      const allResources = getResourceAvailability();
      const facilityResources = allResources.filter(r => r.facilityId === facility.id);
      setResources(facilityResources);

      // Group resources by category
      const grouped = facilityResources.reduce((acc, resource) => {
        if (!acc[resource.resourceType]) {
          acc[resource.resourceType] = [];
        }
        acc[resource.resourceType].push(resource);
        return acc;
      }, {});

      setGroupedResources(grouped);
    }
  }, [isOpen, facility]);

  if (!isOpen || !facility) return null;

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

  const categoryIcons = {
    [resourceCategories.MEDICINES]: Pill,
    [resourceCategories.BLOOD]: Droplet,
    [resourceCategories.BEDS]: Bed,
    [resourceCategories.EQUIPMENT]: Activity
  };

  const categoryLabels = {
    [resourceCategories.MEDICINES]: 'Medicines',
    [resourceCategories.BLOOD]: 'Blood Supply',
    [resourceCategories.BEDS]: 'Hospital Beds',
    [resourceCategories.EQUIPMENT]: 'Medical Equipment'
  };

  const getAvailableCount = (categoryResources) => {
    return categoryResources.filter(r => r.status === 'available').length;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Building2 className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold">{facility.name}</h2>
                  <p className="text-primary-100 text-sm font-medium">
                    {facilityTypeLabels[facility.type]}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-primary-100">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{facility.address}</span>
                </div>
                {distance !== null && (
                  <div className="flex items-center text-sm text-primary-100">
                    <span className="font-semibold">📍 {distance.toFixed(1)} km away</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-primary-100">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{facility.phone}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Resource Categories */}
          {Object.keys(groupedResources).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedResources).map(([category, categoryResources]) => {
                const Icon = categoryIcons[category];
                const availableCount = getAvailableCount(categoryResources);
                
                return (
                  <div key={category} className="card-modern p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {categoryLabels[category]}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {availableCount} of {categoryResources.length} available
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200/60 dark:border-gray-600/60 hover:border-primary-300/60 dark:hover:border-primary-500/60 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {resource.resourceName}
                            </span>
                            <StatusBadge status={resource.status} />
                          </div>
                          {resource.stock !== undefined && (
                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                              <span>Stock: {resource.stock} units</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimeAgo(resource.lastUpdated)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">No resources available for this facility</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {resources.length > 0 ? formatTimeAgo(resources[0].lastUpdated) : 'N/A'}
            </p>
            <button
              onClick={onClose}
              className="btn-primary px-6 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailModal;
