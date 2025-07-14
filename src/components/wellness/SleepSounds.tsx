import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Moon, Cloud, Wind, Music } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  icon: keyof typeof icons;
  category: string;
  audioUrl: string;
}

const icons = {
  Moon,
  Cloud,
  Wind,
  Music
};

// Create audio context for generating sounds
const createWhiteNoise = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioContext.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.1;
  whiteNoise.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { source: whiteNoise, gain: gainNode, context: audioContext };
};

// Create oscillator for rain sound
const createRainSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.1;

  // Create multiple oscillators for a more realistic rain sound
  const oscillators = [];
  const frequencies = [400, 600, 800, 1000, 1200];

  frequencies.forEach(freq => {
    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    oscGain.gain.value = 0.02;
    
    osc.connect(oscGain);
    oscGain.connect(gainNode);
    
    oscillators.push(osc);
  });

  gainNode.connect(audioContext.destination);
  return { oscillators, gain: gainNode, context: audioContext };
};

const SleepSounds: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [timer, setTimer] = useState(30); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const audioRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sounds: Sound[] = [
    {
      id: '1',
      name: 'Rain',
      icon: 'Cloud',
      category: 'Nature',
      audioUrl: 'rain'
    },
    {
      id: '2',
      name: 'Ocean Waves',
      icon: 'Wind',
      category: 'Nature',
      audioUrl: 'waves'
    },
    {
      id: '3',
      name: 'White Noise',
      icon: 'Wind',
      category: 'Ambient',
      audioUrl: 'white-noise'
    },
    {
      id: '4',
      name: 'Soft Piano',
      icon: 'Music',
      category: 'Music',
      audioUrl: 'piano'
    }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        if (audioRef.current.source) {
          audioRef.current.source.stop();
        }
        if (audioRef.current.oscillators) {
          audioRef.current.oscillators.forEach((osc: any) => osc.stop());
        }
        if (audioRef.current.context) {
          audioRef.current.context.close();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && audioRef.current.gain) {
      audioRef.current.gain.gain.value = volume;
    }
  }, [volume]);

  const handlePlay = () => {
    if (!selectedSound) return;

    if (isPlaying) {
      if (audioRef.current) {
        if (audioRef.current.source) {
          audioRef.current.source.stop();
        }
        if (audioRef.current.oscillators) {
          audioRef.current.oscillators.forEach((osc: any) => osc.stop());
        }
        if (audioRef.current.context) {
          audioRef.current.context.close();
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      // Create new sound based on selection
      if (selectedSound.audioUrl === 'white-noise') {
        audioRef.current = createWhiteNoise();
        audioRef.current.source.start();
      } else if (selectedSound.audioUrl === 'rain') {
        audioRef.current = createRainSound();
        audioRef.current.oscillators.forEach((osc: any) => osc.start());
      }
      startTimer();
    }

    setIsPlaying(!isPlaying);
  };

  const startTimer = () => {
    setTimeLeft(timer * 60);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStop = () => {
    if (audioRef.current) {
      if (audioRef.current.source) {
        audioRef.current.source.stop();
      }
      if (audioRef.current.oscillators) {
        audioRef.current.oscillators.forEach((osc: any) => osc.stop());
      }
      if (audioRef.current.context) {
        audioRef.current.context.close();
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sleep Sounds</h2>
      <p className="text-gray-600 mb-8">
        Choose from a variety of calming sounds to help you relax and fall asleep.
      </p>

      {/* Sound Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {sounds.map(sound => {
          const IconComponent = icons[sound.icon];
          return (
            <button
              key={sound.id}
              onClick={() => {
                if (selectedSound?.id !== sound.id) {
                  handleStop();
                }
                setSelectedSound(sound);
              }}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedSound?.id === sound.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50'
              }`}
            >
              <IconComponent className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-medium">{sound.name}</div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {selectedSound ? (
          <>
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {selectedSound.name}
              </h3>
              <p className="text-gray-500">
                {selectedSound.category}
              </p>
            </div>

            {/* Timer Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timer
              </label>
              <div className="flex justify-center space-x-2">
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimer(mins);
                      if (isPlaying) {
                        startTimer();
                      }
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      timer === mins
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVolume(0)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {volume === 0 ? <VolumeX /> : <Volume2 />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handlePlay}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Play
                  </>
                )}
              </button>
              {timeLeft > 0 && (
                <div className="text-gray-600">
                  {formatTime(timeLeft)} remaining
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Select a sound to begin
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-purple-50 rounded-lg p-4">
        <h3 className="font-medium text-purple-800 mb-2">Sleep Tips:</h3>
        <ul className="text-purple-700 space-y-2">
          <li>• Keep your bedroom cool and dark</li>
          <li>• Stick to a regular sleep schedule</li>
          <li>• Avoid screens before bedtime</li>
          <li>• Practice relaxation techniques</li>
          <li>• Use calming sounds at a low volume</li>
        </ul>
      </div>
    </div>
  );
};

export default SleepSounds;
