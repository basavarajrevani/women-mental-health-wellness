import { motion } from 'framer-motion';
import { FaPhone, FaExclamationTriangle } from 'react-icons/fa';

const EmergencyCard = () => {
  const emergencyNumbers = [
    { name: 'National Crisis Hotline', number: '1-800-273-8255' },
    { name: 'Women\'s Crisis Support', number: '1-800-799-7233' },
    { name: 'Emergency Services', number: '911' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 p-6 rounded-xl shadow-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaExclamationTriangle className="text-red-500 text-2xl" />
        <h3 className="text-xl font-semibold text-red-700">Emergency Helplines</h3>
      </div>
      
      <div className="space-y-3">
        {emergencyNumbers.map((contact) => (
          <div key={contact.number} className="flex items-center justify-between bg-white p-3 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{contact.name}</p>
              <p className="text-red-600 font-semibold">{contact.number}</p>
            </div>
            <a
              href={`tel:${contact.number}`}
              className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
            >
              <FaPhone className="text-red-600" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-red-100 rounded-lg">
        <p className="text-red-700 text-sm">
          If you're in immediate danger, please call emergency services immediately.
          These helplines are available 24/7 and are completely confidential.
        </p>
      </div>
    </motion.div>
  );
};

export default EmergencyCard;
