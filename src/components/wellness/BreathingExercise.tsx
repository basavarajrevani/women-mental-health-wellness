import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(3);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time === 0) {
            // Transition to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return 7; // Hold duration
              case 'hold':
                setPhase('exhale');
                return 8; // Exhale duration
              case 'exhale':
                setPhase('rest');
                return 4; // Rest duration
              case 'rest':
                setPhase('inhale');
                setCycles(c => {
                  if (c + 1 >= totalCycles) {
                    setIsActive(false);
                    return 0;
                  }
                  return c + 1;
                });
                return 4; // Inhale duration
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, totalCycles]);

  const handleStart = () => {
    setIsActive(!isActive);
    if (!isActive && phase === 'inhale' && timeLeft === 4) {
      setCycles(0);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(4);
    setCycles(0);
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly through your nose';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Exhale slowly through your mouth';
      case 'rest':
        return 'Rest and prepare for next breath';
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-100';
      case 'hold':
        return 'scale-100';
      case 'exhale':
        return 'scale-75';
      case 'rest':
        return 'scale-75';
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">4-7-8 Breathing Technique</h2>
      <p className="text-gray-600 mb-8">
        This breathing pattern can help reduce anxiety and help you relax. Practice for at least 3 cycles.
      </p>

      {/* Breathing Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div
          className={`absolute inset-0 bg-purple-100 rounded-full transition-transform duration-1000 ${getCircleSize()}`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{timeLeft}</div>
            <div className="text-sm text-gray-600">{getInstructions()}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStart}
            className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="mr-2" />
            Reset
          </button>
        </div>

        <div className="text-gray-600">
          Cycle {cycles + 1} of {totalCycles}
        </div>

        {/* Cycle Selector */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-gray-600">Number of cycles:</span>
          <select
            value={totalCycles}
            onChange={(e) => setTotalCycles(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
