import React from 'react';
import { Play, Clock } from 'lucide-react';

interface VideoResourceProps {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
}

const VideoResource: React.FC<VideoResourceProps> = ({ title, thumbnailUrl, videoUrl, duration }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img src={thumbnailUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors"
          >
            <Play className="w-6 h-6 text-purple-600" />
          </a>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-md flex items-center">
          <Clock className="w-4 h-4 text-white mr-1" />
          <span className="text-white text-sm">{duration}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 text-sm hover:underline"
        >
          Watch Video
        </a>
      </div>
    </div>
  );
};

export default VideoResource;
