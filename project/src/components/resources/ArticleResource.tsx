import React from 'react';
import { Download, FileText, Clock } from 'lucide-react';

interface ArticleResourceProps {
  title: string;
  description: string;
  pdfUrl: string;
  readingTime: string;
  author: string;
}

const ArticleResource: React.FC<ArticleResourceProps> = ({
  title,
  description,
  pdfUrl,
  readingTime,
  author
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">By {author}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {readingTime} read
          </div>
        </div>
        <div className="bg-purple-100 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <a
          href={pdfUrl}
          download
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <Download className="w-4 h-4 mr-1" />
          Download PDF
        </a>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 text-sm"
        >
          Read Online
        </a>
      </div>
    </div>
  );
};

export default ArticleResource;
