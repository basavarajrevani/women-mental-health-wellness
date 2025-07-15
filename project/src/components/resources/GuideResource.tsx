import React, { useState } from 'react';
import { ChevronRight, BookOpen, CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  content: string;
  completed: boolean;
}

interface GuideResourceProps {
  title: string;
  description: string;
  steps: Step[];
}

const GuideResource: React.FC<GuideResourceProps> = ({ title, description, steps }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    if (activeStep === stepId) {
      setActiveStep(null);
    } else {
      setActiveStep(stepId);
    }
  };

  const markAsComplete = (stepId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="bg-purple-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="border rounded-lg overflow-hidden">
            <div
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
                activeStep === step.id ? 'bg-purple-50' : ''
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => markAsComplete(step.id, e)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    completedSteps.includes(step.id)
                      ? 'text-green-600'
                      : 'text-gray-400 hover:text-purple-600'
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
                <span className={`font-medium ${
                  completedSteps.includes(step.id) ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {step.title}
                </span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  activeStep === step.id ? 'rotate-90' : ''
                }`}
              />
            </div>
            {activeStep === step.id && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-gray-600">{step.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {completedSteps.length} of {steps.length} steps completed
          </span>
          {completedSteps.length === steps.length && (
            <span className="text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Guide Completed!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideResource;
