import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Building, Clock, Filter, Map } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance: number;
  type: string;
  specialization?: string;
  phone?: string;
  opening_hours?: string;
  website?: string;
  cluster?: number;
}

const MedicalSupport = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(5000); // Default to 5km

  const filterOptions = [
    { value: 'all', label: 'All Facilities' },
    { value: 'mental', label: 'Mental Health' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'psychologist', label: 'Psychologist' },
    { value: 'therapy', label: 'Therapy Centers' },
    { value: 'clinic', label: 'Local Clinics' }
  ];

  const distanceOptions = [
    { value: 2000, label: '2 km' },
    { value: 5000, label: '5 km' },
    { value: 10000, label: '10 km' },
    { value: 25000, label: '25 km' },
    { value: 50000, label: '50 km' },
    { value: 100000, label: '100 km' }
  ];

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const fetchNearbyHospitals = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      // First try Overpass API
      const query = `
        [out:json][timeout:50];
        (
          // Local clinics and small healthcare facilities (closer range)
          node["healthcare"="clinic"](around:5000, ${latitude}, ${longitude});
          way["healthcare"="clinic"](around:5000, ${latitude}, ${longitude});
          node["amenity"="clinic"](around:5000, ${latitude}, ${longitude});
          way["amenity"="clinic"](around:5000, ${latitude}, ${longitude});
          
          // Doctor's offices and small practices
          node["healthcare"="doctor"](around:5000, ${latitude}, ${longitude});
          way["healthcare"="doctor"](around:5000, ${latitude}, ${longitude});
          
          // General practitioners
          node["healthcare"="general"](around:5000, ${latitude}, ${longitude});
          way["healthcare"="general"](around:5000, ${latitude}, ${longitude});
          
          // Mental health specific facilities (wider range)
          node["healthcare"~"mental_health|psychiatry|psychology"](around:100000, ${latitude}, ${longitude});
          way["healthcare"~"mental_health|psychiatry|psychology"](around:100000, ${latitude}, ${longitude});
          
          // Counseling and therapy
          node["healthcare"~"counselling|counseling|therapist"](around:100000, ${latitude}, ${longitude});
          way["healthcare"~"counselling|counseling|therapist"](around:100000, ${latitude}, ${longitude});
          
          // Mental health departments and specialized clinics
          node["healthcare:speciality"~"mental|psychiatry|psychology"](around:100000, ${latitude}, ${longitude});
          way["healthcare:speciality"~"mental|psychiatry|psychology"](around:100000, ${latitude}, ${longitude});
          
          // Healthcare centers
          node["healthcare"="centre"](around:10000, ${latitude}, ${longitude});
          way["healthcare"="centre"](around:10000, ${latitude}, ${longitude});
          
          // Hospitals with mental health services
          node["healthcare"="hospital"]["mental_health"="yes"](around:50000, ${latitude}, ${longitude});
          way["healthcare"="hospital"]["mental_health"="yes"](around:50000, ${latitude}, ${longitude});
          
          // General hospitals as fallback
          node["amenity"="hospital"](around:25000, ${latitude}, ${longitude});
          way["amenity"="hospital"](around:25000, ${latitude}, ${longitude});
        );
        out body center qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Overpass API');
      }

      const data = await response.json();
      
      let processedHospitals = data.elements
        .filter((element: any) => {
          const hasLocation = element.lat && element.lon || (element.center && element.center.lat && element.center.lon);
          return hasLocation && element.tags;
        })
        .map((element: any) => {
          const lat = element.lat || element.center.lat;
          const lon = element.lon || element.center.lon;
          const distance = calculateDistance(latitude, longitude, lat, lon);
          const tags = element.tags;

          // Enhanced facility type detection
          let type = 'Medical Facility';
          let specialization = 'General Healthcare';

          if (tags.healthcare === 'clinic' || tags.amenity === 'clinic') {
            type = 'Clinic';
            specialization = 'Local Clinic';
          }

          // Check for mental health specializations
          if (tags['healthcare:speciality']?.match(/mental|psychiatry|psychology/i)) {
            specialization = 'Mental Health';
          } else if (tags.healthcare?.match(/psychiatry|psychology/i)) {
            specialization = tags.healthcare.charAt(0).toUpperCase() + tags.healthcare.slice(1);
          } else if (tags.healthcare?.match(/counselling|counseling|therapist/i)) {
            specialization = 'Counseling';
          } else if (tags.mental_health === 'yes') {
            specialization = 'Mental Health';
          } else if (tags.healthcare === 'doctor') {
            specialization = 'Doctor\'s Office';
          }

          // Construct address
          let address = 'Address not available';
          if (tags['addr:full']) {
            address = tags['addr:full'];
          } else if (tags['addr:street']) {
            address = `${tags['addr:street']}${tags['addr:housenumber'] ? ' ' + tags['addr:housenumber'] : ''}`;
            if (tags['addr:city']) address += `, ${tags['addr:city']}`;
          } else if (tags.address) {
            address = tags.address;
          }

          return {
            id: element.id.toString(),
            name: tags.name || tags.operator || tags['operator:name'] || 
                  (specialization === 'Doctor\'s Office' ? 'Dr.' + (tags.doctor || 'Medical Office') : 'Medical Facility'),
            address,
            lat,
            lon,
            distance,
            type,
            specialization,
            phone: tags.phone || tags['contact:phone'] || tags['phone:mobile'],
            opening_hours: tags.opening_hours || tags['service:hours'],
            website: tags.website || tags['contact:website'] || tags.url
          };
        });

      // Sort by distance first
      processedHospitals = processedHospitals.sort((a: Hospital, b: Hospital) => a.distance - b.distance);

      if (processedHospitals.length === 0) {
        setError('No medical facilities found in your area. Try expanding the search radius.');
      } else {
        setHospitals(processedHospitals);
        applyFilters(processedHospitals, selectedFilter, distanceFilter);
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Error fetching nearby hospitals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Separate function to apply filters
  const applyFilters = (facilities: Hospital[], typeFilter: string, maxDistance: number) => {
    let filtered = facilities;

    // Apply distance filter
    filtered = filtered.filter(facility => facility.distance <= maxDistance);

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(facility => {
        const searchTerms = [
          facility.type.toLowerCase(),
          facility.specialization.toLowerCase(),
          facility.name.toLowerCase()
        ];
        
        // Special case for mental health facilities
        if (typeFilter === 'mental') {
          return searchTerms.some(term => 
            term.includes('mental') || 
            term.includes('psychiatry') || 
            term.includes('psychology')
          );
        }
        
        return searchTerms.some(term => term.includes(typeFilter));
      });
    }

    setFilteredHospitals(filtered);
  };

  useEffect(() => {
    if (hospitals.length > 0) {
      applyFilters(hospitals, selectedFilter, distanceFilter);
    }
  }, [selectedFilter, distanceFilter]);

  useEffect(() => {
    const getUserLocation = () => {
      setLoading(true);
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          await fetchNearbyHospitals(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          setError('Unable to retrieve your location. Please enable location services.');
          setLoading(false);
        }
      );
    };

    getUserLocation();
  }, []);

  const getDirectionsUrl = (hospital: Hospital) => {
    if (!userLocation) return '#';
    return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lon}`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Filters Section */}
      <div className="mb-8 space-y-6">
        {/* Type Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-700">Filter by Type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  selectedFilter === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-700">Filter by Distance</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {distanceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDistanceFilter(option.value)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  distanceFilter === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 text-gray-600 font-medium">
        Found {filteredHospitals.length} facilities within {distanceFilter/1000}km
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600 font-medium">Finding nearby facilities...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900 leading-tight">{hospital.name}</h3>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                  {formatDistance(hospital.distance)}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-purple-500" />
                  <span className="text-sm">{hospital.address}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Building className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" />
                  <span className="text-sm font-medium capitalize">{hospital.specialization}</span>
                </div>
                
                {hospital.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" />
                    <a href={`tel:${hospital.phone}`} className="text-sm hover:text-purple-600 transition-colors">
                      {hospital.phone}
                    </a>
                  </div>
                )}

                {hospital.opening_hours && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" />
                    <span className="text-sm">{hospital.opening_hours}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {hospital.website && (
                  <a
                    href={hospital.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium"
                  >
                    Visit Website
                  </a>
                )}
                <a
                  href={getDirectionsUrl(hospital)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm font-medium gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            Try adjusting your filters or increasing the search radius to find more facilities in your area.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalSupport;
