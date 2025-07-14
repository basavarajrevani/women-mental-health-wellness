import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheck, FaEdit } from 'react-icons/fa';

interface SafetyStep {
  id: number;
  title: string;
  completed: boolean;
  content: string;
}

const SafetyPlanCard = () => {
  const [steps, setSteps] = useState<SafetyStep[]>([
    {
      id: 1,
      title: 'Identify Warning Signs',
      completed: false,
      content: 'List personal warning signs that may indicate a crisis is developing'
    },
    {
      id: 2,
      title: 'Internal Coping Strategies',
      completed: false,
      content: 'Activities I can do to take my mind off problems without contacting another person'
    },
    {
      id: 3,
      title: 'People and Social Settings',
      completed: false,
      content: 'People and places that provide distraction from crisis'
    },
    {
      id: 4,
      title: 'People I Can Ask for Help',
      completed: false,
      content: 'People who can help provide support during a crisis'
    },
    {
      id: 5,
      title: 'Professional Resources',
      completed: false,
      content: 'List of professionals or agencies to contact during a crisis'
    }
  ]);

  const toggleStep = (id: number) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 p-6 rounded-xl shadow-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <FaShieldAlt className="text-blue-500 text-2xl" />
        <h3 className="text-xl font-semibold text-blue-700">Safety Planning</h3>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className="bg-white p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`p-2 rounded-full transition-colors ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  {step.completed ? (
                    <FaCheck className="text-green-600" />
                  ) : (
                    <FaEdit className="text-gray-600" />
                  )}
                </button>
                <h4 className="font-medium text-gray-800">{step.title}</h4>
              </div>
            </div>
            <p className="text-gray-600 ml-11">{step.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-blue-700 text-sm">
          Your safety plan is private and stored locally. Update it regularly and share with trusted people who can help during a crisis.
        </p>
      </div>
    </motion.div>
  );
};

export default SafetyPlanCard;
