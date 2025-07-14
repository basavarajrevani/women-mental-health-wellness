import React from 'react';
import { Navigation } from '../components/layout/Navigation';
import { RealTimeResources } from '../components/user/RealTimeResources';

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <RealTimeResources />
        </div>
      </main>
    </div>
  );
};

export default Resources;
