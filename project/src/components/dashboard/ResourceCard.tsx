import React from 'react';

interface ResourceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
}

export function ResourceCard({ title, description, imageUrl, tag }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="inline-block px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded-full mb-2">
          {tag}
        </span>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}