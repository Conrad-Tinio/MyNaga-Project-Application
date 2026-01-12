import { useState, useMemo, useEffect } from 'react';
import { facilities, facilityTypes, getResourceAvailability, resourceCategories, resourceStatus, calculateDistance } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import StatusBadge from '../components/StatusBadge';
import LocationIndicator from '../components/LocationIndicator';
import FacilityDetailModal from '../components/FacilityDetailModal';
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
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacility(null);
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
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-3">
            <span className="text-xs font-semibold text-primary-700 bg-primary-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-primary-200/50 uppercase tracking-wide">
              Real-time Monitoring
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 leading-tight">
            Medical Resource Availability
          </h1>
          <p className="text-lg text-gray-600">
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
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              emergencyMode
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                : 'btn-secondary border-red-300 hover:border-red-400 hover:bg-red-50'
            }`}
          >
            <AlertCircle className={`w-5 h-5 ${emergencyMode ? 'animate-pulse' : ''}`} />
            <span>{emergencyMode ? 'Emergency Mode Active' : 'Activate Emergency Mode'}</span>
          </button>
          {emergencyMode && (
            <p className="mt-3 text-sm text-red-600 font-medium animate-fade-in flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Showing only facilities with available resources, sorted by proximity</span>
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-slide-up">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search for resources or facilities (e.g., Amoxicillin, Bicol Medical Center)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern w-full pl-12 pr-4 py-3"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 animate-slide-up">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2 px-5 py-2.5 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-md">
                Active
              </span>
            )}
          </button>

          {showFilters && (
            <div className="mt-4 card-modern p-6 animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resource Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-modern w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facility Type
                  </label>
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="input-modern w-full"
                  >
                    <option value="">All Facilities</option>
                    {facilityTypeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="input-modern w-full"
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
                  className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="h-1 w-1 bg-primary-500 rounded-full"></div>
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900 text-lg">{filteredResults.length}</span> results
            </p>
          </div>
        </div>

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <ResourceCard
                  resource={item}
                  facility={item.facility}
                  availability={item}
                  userLocation={userLocation}
                  showDetails={isAdmin()}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-modern p-12 text-center animate-scale-in">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to see more results.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-primary px-6 py-2.5 rounded-xl"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 glass bg-blue-50/60 border border-blue-200/40 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">Disclaimer:</strong> This is a prototype system. Resource availability data is for demonstration purposes only. 
            Always verify availability by contacting facilities directly. This system does not provide medical diagnoses or advice.
          </p>
        </div>
      </div>

      {/* Facility Detail Modal */}
      <FacilityDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        facility={selectedFacility}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Dashboard;

