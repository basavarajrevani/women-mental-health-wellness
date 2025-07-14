import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ExternalLink, Phone } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  rating: number;
  image: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

const Partners = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const partners: Partner[] = [
    {
      id: 1,
      name: "Mindful Wellness Center",
      type: "Therapy Center",
      description: "Professional mental health services with a focus on women's well-being.",
      location: "123 Healing Street, New York",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      services: ["Individual Therapy", "Group Sessions", "Workshops"],
      contact: {
        phone: "+1 (555) 123-4567",
        email: "contact@mindfulwellness.com",
        website: "https://mindfulwellness.com"
      }
    },
    {
      id: 2,
      name: "Women's Health Alliance",
      type: "Healthcare",
      description: "Comprehensive healthcare services tailored for women's physical and mental health.",
      location: "456 Care Avenue, Boston",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500",
      services: ["Mental Health", "Physical Health", "Counseling"],
      contact: {
        phone: "+1 (555) 234-5678",
        email: "info@womenshealth.org",
        website: "https://womenshealth.org"
      }
    },
    {
      id: 3,
      name: "Serenity Counseling",
      type: "Counseling",
      description: "Specialized counseling services in a comfortable and safe environment.",
      location: "789 Peace Lane, San Francisco",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=500",
      services: ["Individual Counseling", "Couples Therapy", "Support Groups"],
      contact: {
        phone: "+1 (555) 345-6789",
        email: "help@serenity.com",
        website: "https://serenity.com"
      }
    }
  ];

  const types = Array.from(new Set(partners.map(partner => partner.type)));

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || partner.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Our Partners
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with trusted mental health professionals and organizations
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search partners..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    selectedType === type
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-500 shadow-sm'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid gap-6">
            {filteredPartners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full md:w-48 object-cover"
                      src={partner.image}
                      alt={partner.name}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h2>
                        <span className="inline-block px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-sm font-medium">
                          {partner.type}
                        </span>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-yellow-700">{partner.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{partner.description}</p>
                    
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{partner.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {partner.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={`tel:${partner.contact.phone}`}
                        className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{partner.contact.phone}</span>
                      </a>
                      <a
                        href={partner.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Visit Website</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
