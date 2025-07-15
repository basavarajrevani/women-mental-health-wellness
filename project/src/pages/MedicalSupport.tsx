import React from 'react';
import MedicalSupportComponent from '../components/MedicalSupport';

const MedicalSupport: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Medical Support Centers
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find nearby mental health support centers and hospitals. We'll help you locate the closest facilities that match your needs.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <MedicalSupportComponent />
        </div>
      </div>
    </div>
  );
};

export default MedicalSupport;
