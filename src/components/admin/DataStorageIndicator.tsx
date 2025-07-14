import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Download, 
  Upload, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { persistenceHelpers } from '../../services/DataPersistence';

export const DataStorageIndicator: React.FC = () => {
  const [storageSize, setStorageSize] = useState('0 KB');
  const [showDetails, setShowDetails] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStorageInfo = () => {
    setStorageSize(persistenceHelpers.getStorageSize());
  };

  const handleExportData = () => {
    try {
      const data = persistenceHelpers.exportBackup();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wmh-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLastBackup(new Date().toLocaleString());
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = persistenceHelpers.importBackup(data);
            if (success) {
              alert('Data imported successfully! Please refresh the page.');
              window.location.reload();
            } else {
              alert('Import failed. Please check the file format.');
            }
          } catch (error) {
            console.error('Import failed:', error);
            alert('Import failed. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      persistenceHelpers.clearAllData();
      alert('All data cleared. The page will refresh with default data.');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Data Storage</h3>
            <p className="text-sm text-gray-600">Local storage management</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Info className="h-4 w-4" />
          {showDetails ? 'Hide' : 'Show'} Details
        </motion.button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Storage Used</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{storageSize}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Status</span>
          </div>
          <p className="text-lg font-bold text-green-900">Active</p>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t pt-4 space-y-4"
        >
          {/* Storage Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Storage Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Storage Type:</span>
                <span className="text-blue-900 font-medium">Browser LocalStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Data Persistence:</span>
                <span className="text-blue-900 font-medium">Session + Browser Cache</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Auto-Save:</span>
                <span className="text-blue-900 font-medium">Enabled</span>
              </div>
              {lastBackup && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Last Backup:</span>
                  <span className="text-blue-900 font-medium">{lastBackup}</span>
                </div>
              )}
            </div>
          </div>

          {/* Data Management Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="font-medium">Export Data</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImportData}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="font-medium">Import Data</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearData}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="font-medium">Clear Data</span>
            </motion.button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">Important Notes</h5>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Data is stored locally in your browser</li>
                  <li>• Clearing browser data will remove all content</li>
                  <li>• Export data regularly for backup</li>
                  <li>• In production, this would use a real database</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
