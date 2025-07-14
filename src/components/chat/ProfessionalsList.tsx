import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, DollarSign, Calendar } from 'lucide-react';
import { HealthcareProfessional } from '../../types/chat';

interface ProfessionalsListProps {
  professionals: HealthcareProfessional[];
  onSelect: (professional: HealthcareProfessional) => void;
}

export function ProfessionalsList({ professionals, onSelect }: ProfessionalsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Healthcare Professionals
      </h3>
      {professionals.map((professional) => (
        <motion.div
          key={professional.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-start gap-4">
            <img
              src={professional.image}
              alt={professional.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{professional.name}</h4>
                  <p className="text-sm text-gray-600">{professional.title}</p>
                  <p className="text-sm text-purple-600">{professional.specialization}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {professional.rating} ({professional.totalReviews})
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{professional.experience} years exp.</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>{professional.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${professional.consultationFee}/session</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {professional.availability.nextAvailable}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {professional.availability.availableDays.map((day, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-sm"
                >
                  {day}
                </span>
              ))}
            </div>
            <button
              onClick={() => onSelect(professional)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Book Consultation
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
