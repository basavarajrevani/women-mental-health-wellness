import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Heart, Users, Award, ChevronDown, ExternalLink, Filter, CheckCircle } from 'lucide-react';
import { useGlobalData } from '../context/GlobalDataContext';

interface NGO {
  id: string;
  name: string;
  description: string;
  mission: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Filter {
  service: string;
  verified: string;
}

export default function NGOs() {
  const { activeNGOs } = useGlobalData();
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>({
    service: '',
    verified: ''
  });
  const [expandedNGO, setExpandedNGO] = useState<string | null>(null);

  useEffect(() => {
    // Load NGOs from global data context
    setNgos(activeNGOs);
  }, [activeNGOs]);

  // Get unique services for filter
  const allServices = Array.from(new Set(ngos.flatMap(ngo => ngo.services)));

  const filteredNGOs = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.mission.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = !filter.service || ngo.services.includes(filter.service);
    const matchesVerified = !filter.verified ||
                           (filter.verified === 'verified' && ngo.isVerified) ||
                           (filter.verified === 'unverified' && !ngo.isVerified);

    return matchesSearch && matchesService && matchesVerified;
  });

  const handleContactNGO = (ngo: NGO, method: 'email' | 'phone' | 'website') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${ngo.email}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${ngo.phone}`, '_blank');
        break;
      case 'website':
        window.open(ngo.website, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            NGO Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Connect with verified NGOs dedicated to mental health support and women's wellness
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filter.service}
                onChange={(e) => setFilter(prev => ({ ...prev, service: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Services</option>
                {allServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filter.verified}
                onChange={(e) => setFilter(prev => ({ ...prev, verified: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All NGOs</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{ngos.length}</div>
            <div className="text-gray-600">Total NGOs</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{ngos.filter(n => n.isVerified).length}</div>
            <div className="text-gray-600">Verified Partners</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{allServices.length}</div>
            <div className="text-gray-600">Services Available</div>
          </div>
        </div>

        {/* NGO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredNGOs.map((ngo) => (
              <motion.div
                key={ngo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {ngo.logo ? (
                        <img src={ngo.logo} alt={ngo.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Heart className="h-6 w-6 text-pink-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                        {ngo.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ngo.description}</p>

                  <div className="space-y-2 mb-4">
                    {ngo.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4" />
                        <button
                          onClick={() => handleContactNGO(ngo, 'website')}
                          className="hover:text-purple-600 flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {ngo.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <button
                          onClick={() => handleContactNGO(ngo, 'email')}
                          className="hover:text-purple-600"
                        >
                          {ngo.email}
                        </button>
                      </div>
                    )}
                    {ngo.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <button
                          onClick={() => handleContactNGO(ngo, 'phone')}
                          className="hover:text-purple-600"
                        >
                          {ngo.phone}
                        </button>
                      </div>
                    )}
                    {ngo.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{ngo.address}</span>
                      </div>
                    )}
                  </div>

                  {ngo.services.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {ngo.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {ngo.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{ngo.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedNGO(expandedNGO === ngo.id ? null : ngo.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {expandedNGO === ngo.id ? 'Show Less' : 'Learn More'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedNGO === ngo.id ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedNGO === ngo.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                        <p className="text-gray-600 text-sm mb-4">{ngo.mission}</p>

                        {ngo.services.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">All Services</h4>
                            <div className="flex flex-wrap gap-1">
                              {ngo.services.map((service, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredNGOs.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-600">
              {searchTerm || filter.service || filter.verified
                ? 'Try adjusting your search or filter criteria.'
                : 'No NGO partners have been added yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
