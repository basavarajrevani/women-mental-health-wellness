import React from 'react';
import Privacy from '../components/Privacy';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Privacy Policy
      </h1>
      <Privacy />
    </div>
  );
};

export default PrivacyPage;
