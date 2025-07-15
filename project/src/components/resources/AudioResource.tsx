import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioResourceProps {
  title: string;
  audioUrl: string;
  duration: string;
}

const AudioResource: React.FC<AudioResourceProps> = ({ title, audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-purple-600" />
            ) : (
              <Play className="w-5 h-5 text-purple-600" />
            )}
          </button>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{duration}</p>
          </div>
        </div>
        <Volume2 className="w-5 h-5 text-gray-400" />
      </div>
      <audio ref={audioRef} src={audioUrl} className="w-full" controls />
    </div>
  );
};

export default AudioResource;
