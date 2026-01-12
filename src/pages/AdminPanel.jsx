import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { facilities, getResourceAvailability, resourceCategories, resourceStatus } from '../data/mockData';
import { Save, AlertTriangle, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  useEffect(() => {
    if (!isAdmin()) return;
    
    // Load availability data
    const data = getResourceAvailability();
    setAvailability(data);
    
    // Check for low stock alerts
    checkLowStockAlerts(data);

    // Load emergency alerts from localStorage (simulating backend)
    const storedAlerts = localStorage.getItem('medmap_emergency_alerts');
    if (storedAlerts) {
      setEmergencyAlerts(JSON.parse(storedAlerts));
    }

    // Listen for new emergency alerts (both storage events and custom events)
    const handleStorageChange = (e) => {
      if (e.key === 'medmap_emergency_alerts') {
        setEmergencyAlerts(JSON.parse(e.newValue || '[]'));
      }
    };
    
    const handleEmergencyAlert = (e) => {
      setEmergencyAlerts(e.detail || []);
    };
    
    // Check for updates periodically
    const checkForAlerts = () => {
      const storedAlerts = localStorage.getItem('medmap_emergency_alerts');
      if (storedAlerts) {
        setEmergencyAlerts(JSON.parse(storedAlerts));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('emergencyAlert', handleEmergencyAlert);
    const interval = setInterval(checkForAlerts, 2000); // Check every 2 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('emergencyAlert', handleEmergencyAlert);
      clearInterval(interval);
    };
  }, [isAdmin]);

  const checkLowStockAlerts = (data) => {
    const alerts = data.filter(item => {
      const threshold = item.resourceType === resourceCategories.BLOOD ? 10 :
                       item.resourceType === resourceCategories.BEDS ? 5 :
                       item.resourceType === resourceCategories.EQUIPMENT ? 5 : 20;
      return item.status === resourceStatus.LOW || (item.stock && item.stock <= threshold);
    }).map(item => {
      const facility = facilities.find(f => f.id === item.facilityId);
      return { ...item, facility };
    });
    setLowStockAlerts(alerts);
  };

  const updateResource = (id, updates) => {
    setAvailability(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates, lastUpdated: new Date().toISOString() };
        // Update status based on stock
        if (updated.stock !== undefined) {
          const threshold = item.resourceType === resourceCategories.BLOOD ? 10 :
                           item.resourceType === resourceCategories.BEDS ? 5 :
                           item.resourceType === resourceCategories.EQUIPMENT ? 5 : 20;
          if (updated.stock === 0) {
            updated.status = resourceStatus.OUT_OF_STOCK;
          } else if (updated.stock <= threshold) {
            updated.status = resourceStatus.LOW;
          } else {
            updated.status = resourceStatus.AVAILABLE;
          }
        }
        return updated;
      }
      return item;
    }));
    
    // Recheck alerts
    const updatedData = availability.map(item => item.id === id ? { ...item, ...updates } : item);
    checkLowStockAlerts(updatedData);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  const filteredAvailability = availability.filter(item => {
    const facilityMatch = !selectedFacility || item.facilityId === parseInt(selectedFacility);
    const categoryMatch = !selectedCategory || item.resourceType === selectedCategory;
    return facilityMatch && categoryMatch;
  });

  const categories = [
    { value: resourceCategories.MEDICINES, label: 'Medicines' },
    { value: resourceCategories.BLOOD, label: 'Blood Supply' },
    { value: resourceCategories.BEDS, label: 'Beds' },
    { value: resourceCategories.EQUIPMENT, label: 'Equipment' }
  ];

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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-3">
            <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Admin Dashboard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            LGU Admin Panel
          </h1>
          <p className="text-lg text-gray-600">
            Manage and update medical resource availability across Naga City facilities
          </p>
        </div>

        {/* Emergency Alerts */}
        {emergencyAlerts.length > 0 && (
          <div className="mb-6 glass bg-red-100/80 border-2 border-red-400/50 rounded-xl p-5 animate-pulse-slow backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-700" />
              <h2 className="text-lg font-bold text-red-900">🚨 Emergency Alerts ({emergencyAlerts.length})</h2>
            </div>
            <div className="space-y-3">
              {emergencyAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="card-modern bg-white rounded-xl p-4 border border-red-300/50 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {alert.resourceType === resourceCategories.BLOOD 
                          ? `Blood Type ${alert.resource}` 
                          : alert.resource}
                      </p>
                      <p className="text-sm text-gray-600">{alert.resourceType}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {alert.description && (
                    <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    {alert.contactNumber && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{alert.contactNumber}</span>
                      </div>
                    )}
                    {alert.location && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location.lat.toFixed(4)}, {alert.location.lon.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                  {alert.nearbyHospitals && alert.nearbyHospitals.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">Alerted Hospitals:</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.nearbyHospitals.map((hospital, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {hospital.name} ({hospital.distance.toFixed(1)}km)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {emergencyAlerts.length > 3 && (
                <p className="text-sm text-red-700 font-medium">...and {emergencyAlerts.length - 3} more emergency alerts</p>
              )}
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {lowStockAlerts.length > 0 && (
          <div className="mb-6 glass bg-red-50/80 border border-red-200/50 rounded-xl p-5 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-900">Low Stock Alerts ({lowStockAlerts.length})</h2>
            </div>
            <div className="space-y-2">
              {lowStockAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between text-sm">
                  <span>
                    <strong>{alert.facility?.name}</strong> - {alert.resourceName}
                  </span>
                  <span className="text-red-600 font-semibold">Stock: {alert.stock || 0}</span>
                </div>
              ))}
              {lowStockAlerts.length > 5 && (
                <p className="text-sm text-red-700">...and {lowStockAlerts.length - 5} more</p>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 card-modern p-5 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Facility
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="input-modern w-full"
              >
                <option value="">All Facilities</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Category
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
          </div>
        </div>

        {/* Save Button */}
        <div className="mb-6 flex justify-end animate-fade-in">
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              saveStatus === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                : 'btn-primary'
            }`}
          >
            {saveStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Resources Table */}
        <div className="card-modern overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAvailability.map((item) => {
                  const facility = facilities.find(f => f.id === item.facilityId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                        <div className="text-sm text-gray-500">{facility?.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.resourceName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={item.stock || 0}
                          onChange={(e) => updateResource(item.id, { stock: parseInt(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(item.lastUpdated)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => updateResource(item.id, { status: resourceStatus.AVAILABLE, stock: 50 })}
                          className="text-primary-600 hover:text-primary-800 font-semibold mr-4 transition-colors hover:underline"
                        >
                          Mark Available
                        </button>
                        <button
                          onClick={() => updateResource(item.id, { status: resourceStatus.OUT_OF_STOCK, stock: 0 })}
                          className="text-red-600 hover:text-red-800 font-semibold transition-colors hover:underline"
                        >
                          Mark Out of Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAvailability.length === 0 && (
          <div className="card-modern p-12 text-center animate-scale-in">
            <p className="text-gray-600 font-medium">No resources found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;



