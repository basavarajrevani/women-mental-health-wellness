import React from 'react';
import NGOList from '../components/NGOList';

const NGOsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Mental Health NGOs
      </h1>
      <NGOList />
    </div>
  );
};

export default NGOsPage;
