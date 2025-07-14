import React from 'react';
import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-purple-600" size={24} />
            <span className="text-xl font-semibold text-gray-900">WomenWell</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Resources</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Support Groups</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}