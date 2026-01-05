import { useState, useMemo, useEffect } from 'react';
import { facilities, facilityTypes, getResourceAvailability, resourceCategories, resourceStatus, calculateDistance } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import StatusBadge from '../components/StatusBadge';
import LocationIndicator from '../components/LocationIndicator';
import { Search, Filter, MapPin, AlertCircle, SlidersHorizontal } from 'lucide-react';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyReports, setEmergencyReports] = useState([]);

  useEffect(() => {
    // Load availability data
    setAvailability(getResourceAvailability());

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

  const handleLocationUpdate = (newLocation) => {
    setUserLocation(newLocation);
  };

  const handleEmergencyReport = (reportData) => {
    setEmergencyReports(prev => [...prev, reportData]);
    console.log('Emergency Report Submitted:', reportData);
    // In a real app, this would send to backend/API
  };

  const filteredResults = useMemo(() => {
    let results = availability;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(item => {
        const facility = facilities.find(f => f.id === item.facilityId);
        return (
          item.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          facility?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter(item => item.resourceType === selectedCategory);
    }

    // Filter by facility type
    if (selectedFacilityType) {
      results = results.filter(item => {
        const facility = facilities.find(f => f.id === item.facilityId);
        return facility?.type === selectedFacilityType;
      });
    }

    // Filter by status
    if (selectedStatus) {
      results = results.filter(item => item.status === selectedStatus);
    }

    // Emergency mode: only show available resources, sorted by distance
    if (emergencyMode) {
      results = results.filter(item => item.status === resourceStatus.AVAILABLE);
      results = results.map(item => {
        const facility = facilities.find(f => f.id === item.facilityId);
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lon, facility.latitude, facility.longitude)
          : Infinity;
        return { ...item, distance, facility };
      });
      results.sort((a, b) => a.distance - b.distance);
    } else {
      // Regular mode: sort by status priority, then by facility name
      results = results.map(item => ({
        ...item,
        facility: facilities.find(f => f.id === item.facilityId)
      }));
      results.sort((a, b) => {
        const statusPriority = {
          [resourceStatus.AVAILABLE]: 1,
          [resourceStatus.LOW]: 2,
          [resourceStatus.OUT_OF_STOCK]: 3
        };
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        return a.facility.name.localeCompare(b.facility.name);
      });
    }

    return results;
  }, [searchQuery, selectedCategory, selectedFacilityType, selectedStatus, emergencyMode, availability, userLocation]);

  const categories = [
    { value: resourceCategories.MEDICINES, label: 'Medicines' },
    { value: resourceCategories.BLOOD, label: 'Blood Supply' },
    { value: resourceCategories.BEDS, label: 'Beds' },
    { value: resourceCategories.EQUIPMENT, label: 'Equipment' }
  ];

  const facilityTypeOptions = [
    { value: facilityTypes.HOSPITAL, label: 'Hospitals' },
    { value: facilityTypes.INFIRMARY, label: 'Infirmaries' },
    { value: facilityTypes.HEALTH_CENTER, label: 'Health Centers' },
    { value: facilityTypes.PHARMACY, label: 'Pharmacies' }
  ];

  const statusOptions = [
    { value: resourceStatus.AVAILABLE, label: 'Available' },
    { value: resourceStatus.LOW, label: 'Low' },
    { value: resourceStatus.OUT_OF_STOCK, label: 'Out of Stock' }
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedFacilityType('');
    setSelectedStatus('');
    setEmergencyMode(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedFacilityType || selectedStatus || emergencyMode;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Resource Availability Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time view of medical resources across Naga City health facilities
          </p>
        </div>

        {/* Location Indicator */}
        <div className="mb-6">
          <LocationIndicator 
            userLocation={userLocation} 
            onLocationUpdate={handleLocationUpdate}
          />
        </div>

        {/* Emergency Mode Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
              emergencyMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-white text-gray-700 border-2 border-red-300 hover:border-red-400'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{emergencyMode ? 'Emergency Mode Active' : 'Activate Emergency Mode'}</span>
          </button>
          {emergencyMode && (
            <p className="mt-2 text-sm text-red-600">
              Showing only facilities with available resources, sorted by proximity
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for resources or facilities (e.g., Amoxicillin, Bicol Medical Center)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>

          {showFilters && (
            <div className="mt-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Type
                  </label>
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Facilities</option>
                    {facilityTypeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Status</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredResults.length}</span> results
          </p>
        </div>

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((item) => (
              <ResourceCard
                key={item.id}
                resource={item}
                facility={item.facility}
                availability={item}
                userLocation={userLocation}
                showDetails={isAdmin()}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to see more results.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Disclaimer:</strong> This is a prototype system. Resource availability data is for demonstration purposes only. 
            Always verify availability by contacting facilities directly. This system does not provide medical diagnoses or advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

