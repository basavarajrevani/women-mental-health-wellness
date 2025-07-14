import React, { useEffect } from 'react';
import { syncAdminDataToPublic } from '../utils/dataSyncUtils';

interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  useEffect(() => {
    const initializeAppData = () => {
      console.log('🚀 Initializing app data on startup...');

      try {
        // Force sync admin data to public storage on app start
        const syncResult = syncAdminDataToPublic();
        console.log('✅ App data initialization complete:', syncResult);
      } catch (error) {
        console.error('❌ Error initializing app data:', error);
      }
    };

    // Wait a bit longer to ensure all contexts are loaded before initializing
    const timeoutId = setTimeout(initializeAppData, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return <>{children}</>;
};

export default DataInitializer;
