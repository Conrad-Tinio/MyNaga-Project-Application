import { useState } from 'react';
import { AlertTriangle, X, MapPin, Phone, Send } from 'lucide-react';
import { facilities, resourceCategories, getResourceAvailability } from '../data/mockData';
import { calculateDistance } from '../data/mockData';

const SOSButton = ({ userLocation, onEmergencyReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resourceOptions = {
    [resourceCategories.MEDICINES]: ['Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Other Medicine'],
    [resourceCategories.BLOOD]: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    [resourceCategories.BEDS]: ['ER Bed', 'Ward Bed', 'ICU Bed'],
    [resourceCategories.EQUIPMENT]: ['Oxygen Tank', 'Ventilator', 'Defibrillator', 'Nebulizer']
  };

  const getNearbyHospitals = () => {
    if (!userLocation) return [];

    const availability = getResourceAvailability();
    const hospitals = facilities.filter(f => 
      f.type === 'hospital' || f.type === 'infirmary'
    );

    return hospitals.map(hospital => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        hospital.latitude,
        hospital.longitude
      );

      // Check if hospital has the requested resource
      const hasResource = resourceType && selectedResource
        ? availability.some(item => {
            if (item.facilityId !== hospital.id) return false;
            if (item.resourceType !== resourceType) return false;
            
            if (resourceType === resourceCategories.BLOOD) {
              return item.resourceName.toLowerCase().includes(selectedResource.toLowerCase());
            }
            return item.resourceName.toLowerCase().includes(selectedResource.toLowerCase());
          })
        : true;

      return {
        ...hospital,
        distance,
        hasResource,
        willBeAlerted: true
      };
    }).sort((a, b) => a.distance - b.distance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const nearbyHospitals = getNearbyHospitals();
      const alertData = {
        resourceType,
        resource: selectedResource,
        description,
        contactNumber,
        location: userLocation,
        timestamp: new Date().toISOString(),
        nearbyHospitals: nearbyHospitals.slice(0, 5) // Alert top 5 nearest
      };

      if (onEmergencyReport) {
        onEmergencyReport(alertData);
      }

      setIsSubmitting(false);
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setSelectedResource('');
        setResourceType('');
        setDescription('');
        setContactNumber('');
      }, 3000);
    }, 1500);
  };

  const nearbyHospitals = getNearbyHospitals();

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-3 shadow-2xl transform transition-all hover:scale-105 flex items-center space-x-2 animate-pulse"
        aria-label="Emergency SOS"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="text-sm font-bold">SOS</span>
      </button>

      {/* Emergency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-red-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Emergency SOS</h2>
                    <p className="text-red-100 text-sm">Report your emergency medical resource need</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSubmitted(false);
                    setSelectedResource('');
                    setResourceType('');
                    setDescription('');
                    setContactNumber('');
                  }}
                  className="text-white hover:text-red-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Nearby hospitals have been notified of your emergency request.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-blue-800">
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                      <li>Stay at your current location if safe</li>
                      <li>Keep your phone accessible</li>
                      <li>Hospitals will contact you shortly</li>
                      <li>If immediate danger, call 911 or local emergency services</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Resource Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What type of resource do you need? *
                    </label>
                    <select
                      value={resourceType}
                      onChange={(e) => {
                        setResourceType(e.target.value);
                        setSelectedResource('');
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select resource type...</option>
                      <option value={resourceCategories.MEDICINES}>Medicine</option>
                      <option value={resourceCategories.BLOOD}>Blood Supply</option>
                      <option value={resourceCategories.BEDS}>Hospital Bed</option>
                      <option value={resourceCategories.EQUIPMENT}>Medical Equipment</option>
                    </select>
                  </div>

                  {/* Specific Resource Selection */}
                  {resourceType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Resource Needed *
                      </label>
                      <select
                        value={selectedResource}
                        onChange={(e) => setSelectedResource(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Select specific resource...</option>
                        {resourceOptions[resourceType]?.map(option => (
                          <option key={option} value={option}>
                            {resourceType === resourceCategories.BLOOD ? `Blood Type ${option}` : option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+63 XXX XXX XXXX"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  {/* Additional Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide any additional information that might help..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  {/* Nearby Hospitals Preview */}
                  {userLocation && nearbyHospitals.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          Nearby Hospitals to be Alerted ({nearbyHospitals.slice(0, 5).length})
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {nearbyHospitals.slice(0, 5).map((hospital, index) => (
                          <div key={hospital.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {index + 1}. {hospital.name}
                            </span>
                            <span className="text-gray-600">
                              {hospital.distance.toFixed(1)} km away
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This is an emergency alert system. 
                      For life-threatening emergencies, please call 911 or your local emergency services immediately.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !resourceType || !selectedResource || !contactNumber}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Alert...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Emergency Alert</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;

