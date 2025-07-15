import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const MeditationTimer: React.FC = () => {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'nature' | 'rain' | 'waves' | 'none'>('none');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playEndSound();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const playEndSound = () => {
    if (!isMuted) {
      // Play a gentle bell sound
      const audio = new Audio('/meditation-bell.mp3');
      audio.play();
    }
  };

  const presetTimes = [5, 10, 15, 20, 30];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meditation Timer</h2>
      <p className="text-gray-600 mb-8">
        Take a moment to sit quietly and focus on your breath. Choose your preferred duration and ambient sound.
      </p>

      {/* Timer Display */}
      <div className="text-6xl font-bold text-purple-600 mb-8">
        {formatTime(timeLeft)}
      </div>

      {/* Duration Presets */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Duration (minutes)</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {presetTimes.map(time => (
            <button
              key={time}
              onClick={() => {
                setDuration(time);
                setTimeLeft(time * 60);
              }}
              className={`px-4 py-2 rounded-lg ${
                duration === time
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Sound Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Ambient Sound</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {['none', 'nature', 'rain', 'waves'].map(sound => (
            <button
              key={sound}
              onClick={() => setAmbientSound(sound as any)}
              className={`px-4 py-2 rounded-lg capitalize ${
                ambientSound === sound
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sound}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center space-x-4">
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
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 text-left bg-purple-50 rounded-lg p-4">
        <h3 className="font-medium text-purple-800 mb-2">Meditation Tips:</h3>
        <ul className="text-purple-700 space-y-2">
          <li>• Find a quiet, comfortable place to sit</li>
          <li>• Keep your back straight but not tense</li>
          <li>• Focus on your natural breath</li>
          <li>• When your mind wanders, gently bring it back to your breath</li>
          <li>• Be kind to yourself - it's normal for thoughts to arise</li>
        </ul>
      </div>
    </div>
  );
};

export default MeditationTimer;
