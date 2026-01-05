// Mock data for MedMap Naga Prototype

export const facilityTypes = {
  HOSPITAL: 'hospital',
  INFIRMARY: 'infirmary',
  HEALTH_CENTER: 'health_center',
  PHARMACY: 'pharmacy'
};

export const resourceStatus = {
  AVAILABLE: 'available',
  LOW: 'low',
  OUT_OF_STOCK: 'out_of_stock'
};

export const facilities = [
  {
    id: 1,
    name: 'Bicol Medical Center',
    type: facilityTypes.HOSPITAL,
    address: 'Concepcion Pequeña, Naga City',
    latitude: 13.6189,
    longitude: 123.1819,
    phone: '+63 54 472-8444',
    isPublic: true
  },
  {
    id: 2,
    name: 'Naga City Hospital',
    type: facilityTypes.HOSPITAL,
    address: 'Balatas Road, Naga City',
    latitude: 13.6290,
    longitude: 123.1870,
    phone: '+63 54 473-1100',
    isPublic: true
  },
  {
    id: 3,
    name: 'San Antonio Infirmary',
    type: facilityTypes.INFIRMARY,
    address: 'San Antonio, Naga City',
    latitude: 13.6250,
    longitude: 123.1750,
    phone: '+63 54 473-2200',
    isPublic: true
  },
  {
    id: 4,
    name: 'Triangulo Health Center',
    type: facilityTypes.HEALTH_CENTER,
    address: 'Triangulo, Naga City',
    latitude: 13.6200,
    longitude: 123.1800,
    phone: '+63 54 473-3300',
    isPublic: true
  },
  {
    id: 5,
    name: 'Peñafrancia Health Center',
    type: facilityTypes.HEALTH_CENTER,
    address: 'Peñafrancia, Naga City',
    latitude: 13.6150,
    longitude: 123.1780,
    phone: '+63 54 473-4400',
    isPublic: true
  },
  {
    id: 6,
    name: 'Naga Central Pharmacy',
    type: facilityTypes.PHARMACY,
    address: 'Panganiban Drive, Naga City',
    latitude: 13.6175,
    longitude: 123.1825,
    phone: '+63 54 473-5500',
    isPublic: true
  },
  {
    id: 7,
    name: 'Mercury Drug Naga',
    type: facilityTypes.PHARMACY,
    address: 'Magsaysay Avenue, Naga City',
    latitude: 13.6220,
    longitude: 123.1840,
    phone: '+63 54 473-6600',
    isPublic: true
  },
  {
    id: 8,
    name: 'Lerma Health Center',
    type: facilityTypes.HEALTH_CENTER,
    address: 'Lerma, Naga City',
    latitude: 13.6280,
    longitude: 123.1760,
    phone: '+63 54 473-7700',
    isPublic: true
  }
];

export const resourceCategories = {
  MEDICINES: 'medicines',
  BLOOD: 'blood',
  BEDS: 'beds',
  EQUIPMENT: 'equipment'
};

export const medicines = [
  { id: 1, name: 'Amoxicillin 500mg', category: resourceCategories.MEDICINES },
  { id: 2, name: 'Paracetamol 500mg', category: resourceCategories.MEDICINES },
  { id: 3, name: 'Ibuprofen 400mg', category: resourceCategories.MEDICINES },
  { id: 4, name: 'Cetirizine 10mg', category: resourceCategories.MEDICINES },
  { id: 5, name: 'Losartan 50mg', category: resourceCategories.MEDICINES },
  { id: 6, name: 'Metformin 500mg', category: resourceCategories.MEDICINES },
  { id: 7, name: 'Omeprazole 20mg', category: resourceCategories.MEDICINES },
  { id: 8, name: 'Salbutamol Inhaler', category: resourceCategories.MEDICINES }
];

export const bloodTypes = [
  { id: 1, name: 'O+', category: resourceCategories.BLOOD },
  { id: 2, name: 'O-', category: resourceCategories.BLOOD },
  { id: 3, name: 'A+', category: resourceCategories.BLOOD },
  { id: 4, name: 'A-', category: resourceCategories.BLOOD },
  { id: 5, name: 'B+', category: resourceCategories.BLOOD },
  { id: 6, name: 'B-', category: resourceCategories.BLOOD },
  { id: 7, name: 'AB+', category: resourceCategories.BLOOD },
  { id: 8, name: 'AB-', category: resourceCategories.BLOOD }
];

export const bedTypes = [
  { id: 1, name: 'ER Beds', category: resourceCategories.BEDS },
  { id: 2, name: 'Ward Beds', category: resourceCategories.BEDS },
  { id: 3, name: 'ICU Beds', category: resourceCategories.BEDS }
];

export const equipment = [
  { id: 1, name: 'Oxygen Tanks', category: resourceCategories.EQUIPMENT },
  { id: 2, name: 'Ventilators', category: resourceCategories.EQUIPMENT },
  { id: 3, name: 'Defibrillators', category: resourceCategories.EQUIPMENT },
  { id: 4, name: 'Nebulizers', category: resourceCategories.EQUIPMENT }
];

// Mock availability data
export const getResourceAvailability = () => {
  const availability = [];
  
  facilities.forEach(facility => {
    // Medicines availability
    medicines.forEach(medicine => {
      const statuses = [resourceStatus.AVAILABLE, resourceStatus.LOW, resourceStatus.OUT_OF_STOCK];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const stock = status === resourceStatus.AVAILABLE ? Math.floor(Math.random() * 100) + 50 :
                   status === resourceStatus.LOW ? Math.floor(Math.random() * 20) + 1 : 0;
      
      availability.push({
        id: `${facility.id}-${medicine.id}`,
        facilityId: facility.id,
        resourceType: resourceCategories.MEDICINES,
        resourceId: medicine.id,
        resourceName: medicine.name,
        status,
        stock,
        lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    // Blood availability (only for hospitals and infirmaries)
    if (facility.type === facilityTypes.HOSPITAL || facility.type === facilityTypes.INFIRMARY) {
      bloodTypes.forEach(blood => {
        const statuses = [resourceStatus.AVAILABLE, resourceStatus.LOW, resourceStatus.OUT_OF_STOCK];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const stock = status === resourceStatus.AVAILABLE ? Math.floor(Math.random() * 50) + 20 :
                     status === resourceStatus.LOW ? Math.floor(Math.random() * 10) + 1 : 0;
        
        availability.push({
          id: `${facility.id}-blood-${blood.id}`,
          facilityId: facility.id,
          resourceType: resourceCategories.BLOOD,
          resourceId: blood.id,
          resourceName: `Blood Type ${blood.name}`,
          status,
          stock,
          lastUpdated: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString()
        });
      });
    }

    // Bed availability (only for hospitals and infirmaries)
    if (facility.type === facilityTypes.HOSPITAL || facility.type === facilityTypes.INFIRMARY) {
      bedTypes.forEach(bed => {
        const statuses = [resourceStatus.AVAILABLE, resourceStatus.LOW, resourceStatus.OUT_OF_STOCK];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const stock = status === resourceStatus.AVAILABLE ? Math.floor(Math.random() * 30) + 10 :
                     status === resourceStatus.LOW ? Math.floor(Math.random() * 5) + 1 : 0;
        
        availability.push({
          id: `${facility.id}-bed-${bed.id}`,
          facilityId: facility.id,
          resourceType: resourceCategories.BEDS,
          resourceId: bed.id,
          resourceName: bed.name,
          status,
          stock,
          lastUpdated: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString()
        });
      });
    }

    // Equipment availability (mainly hospitals)
    if (facility.type === facilityTypes.HOSPITAL) {
      equipment.forEach(eq => {
        const statuses = [resourceStatus.AVAILABLE, resourceStatus.LOW, resourceStatus.OUT_OF_STOCK];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const stock = status === resourceStatus.AVAILABLE ? Math.floor(Math.random() * 25) + 10 :
                     status === resourceStatus.LOW ? Math.floor(Math.random() * 5) + 1 : 0;
        
        availability.push({
          id: `${facility.id}-eq-${eq.id}`,
          facilityId: facility.id,
          resourceType: resourceCategories.EQUIPMENT,
          resourceId: eq.id,
          resourceName: eq.name,
          status,
          stock,
          lastUpdated: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000).toISOString()
        });
      });
    }
  });

  return availability;
};

// Mock analytics data
export const getAnalyticsData = () => {
  return {
    searchFrequency: [
      { resource: 'Amoxicillin 500mg', searches: 342 },
      { resource: 'Paracetamol 500mg', searches: 289 },
      { resource: 'ER Beds', searches: 156 },
      { resource: 'Blood Type O+', searches: 134 },
      { resource: 'Oxygen Tanks', searches: 98 },
      { resource: 'Ward Beds', searches: 87 },
      { resource: 'Salbutamol Inhaler', searches: 76 },
      { resource: 'Blood Type A+', searches: 65 }
    ],
    facilityUtilization: facilities.map(f => ({
      facility: f.name,
      searches: Math.floor(Math.random() * 200) + 50,
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })),
    demandByHour: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      demand: Math.floor(Math.random() * 50) + 10
    }))
  };
};

// Helper function to calculate distance (simplified)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};



