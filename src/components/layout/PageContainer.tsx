import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <div className="h-full">
      {title && (
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
