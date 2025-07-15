import React, { useState, useEffect } from 'react';

interface NGO {
  id: string;
  name: string;
  description: string;
  location: string;
  contact: string;
  website?: string;
  services: string[];
}

const NGOList: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([
    {
      id: '1',
      name: 'NIMHANS',
      description: 'National Institute of Mental Health and Neurosciences - Premier mental health institution',
      location: 'Bangalore, Karnataka',
      contact: '+91-80-26995001',
      website: 'https://nimhans.ac.in',
      services: ['Mental Health Care', 'Research', 'Education', 'Rehabilitation']
    },
    {
      id: '2',
      name: 'The Live Love Laugh Foundation',
      description: 'NGO focused on mental health awareness and support',
      location: 'Bangalore, Karnataka',
      contact: 'info@tlllfoundation.org',
      website: 'https://thelivelovelaughfoundation.org',
      services: ['Awareness Programs', 'Support Groups', 'Resources']
    },
    {
      id: '3',
      name: 'Sangath',
      description: 'Mental health research organization',
      location: 'Goa & Multiple Locations',
      contact: '+91-832-2904666',
      website: 'https://sangath.in',
      services: ['Research', 'Community Programs', 'Training']
    }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ngos.map((ngo) => (
        <div
          key={ngo.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {ngo.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{ngo.description}</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Location:</span> {ngo.location}
            </p>
            <p className="text-sm">
              <span className="font-medium">Contact:</span> {ngo.contact}
            </p>
            {ngo.website && (
              <p className="text-sm">
                <span className="font-medium">Website:</span>{' '}
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Visit Website
                </a>
              </p>
            )}
            <div className="mt-4">
              <span className="font-medium text-sm">Services:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {ngo.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NGOList;
