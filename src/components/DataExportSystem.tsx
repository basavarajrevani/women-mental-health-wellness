import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Share2, 
  FileText, 
  Calendar, 
  BarChart3, 
  Heart, 
  Brain,
  Shield,
  Mail,
  Printer,
  Cloud,
  CheckCircle,
  X,
  Eye,
  Lock,
  Users,
  Clock,
  Filter
} from 'lucide-react';

interface DataExportSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataExportSystem: React.FC<DataExportSystemProps> = ({ isOpen, onClose }) => {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['mood', 'goals', 'progress']);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [shareMethod, setShareMethod] = useState<'download' | 'email' | 'secure_link'>('download');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [includePersonalInfo, setIncludePersonalInfo] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const dataTypes = [
    { id: 'mood', label: 'Mood Tracking', icon: Heart, description: 'Daily mood entries and patterns' },
    { id: 'goals', label: 'Mental Health Goals', icon: Brain, description: 'Goal progress and achievements' },
    { id: 'progress', label: 'Progress Reports', icon: BarChart3, description: 'Overall progress analytics' },
    { id: 'therapy', label: 'Therapy Sessions', icon: Users, description: 'Session notes and insights' },
    { id: 'wellness', label: 'Wellness Activities', icon: Calendar, description: 'Activity logs and effectiveness' },
    { id: 'coping', label: 'Coping Strategies', icon: Shield, description: 'Strategy usage and effectiveness' },
    { id: 'community', label: 'Community Activity', icon: Users, description: 'Posts and interactions (anonymized)' },
  ];

  const handleDataTypeToggle = (typeId: string) => {
    setSelectedDataTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const generateMockData = () => {
    const data: any = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        dateRange: dateRange.start && dateRange.end ? dateRange : null,
        dataTypes: selectedDataTypes,
        format: exportFormat,
        includesPersonalInfo: includePersonalInfo,
      },
    };

    if (selectedDataTypes.includes('mood')) {
      data.moodTracking = {
        totalEntries: 45,
        averageMood: 6.8,
        moodTrend: 'improving',
        entries: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mood: Math.floor(Math.random() * 10) + 1,
          energy: Math.floor(Math.random() * 10) + 1,
          anxiety: Math.floor(Math.random() * 10) + 1,
          sleep: Math.floor(Math.random() * 10) + 1,
          notes: i % 3 === 0 ? 'Had a good day with friends' : '',
        })),
      };
    }

    if (selectedDataTypes.includes('goals')) {
      data.mentalHealthGoals = {
        totalGoals: 5,
        completedGoals: 2,
        averageProgress: 68,
        goals: [
          { id: 1, title: 'Practice daily meditation', progress: 85, status: 'active' },
          { id: 2, title: 'Improve sleep schedule', progress: 60, status: 'active' },
          { id: 3, title: 'Reduce anxiety levels', progress: 45, status: 'active' },
          { id: 4, title: 'Build social connections', progress: 100, status: 'completed' },
          { id: 5, title: 'Develop coping strategies', progress: 75, status: 'active' },
        ],
      };
    }

    if (selectedDataTypes.includes('progress')) {
      data.progressReports = {
        overallProgress: 72,
        weeklyImprovement: 8,
        monthlyTrends: {
          mood: 'improving',
          anxiety: 'stable',
          sleep: 'improving',
          social: 'improving',
        },
        achievements: [
          { title: 'First Week Complete', date: '2024-01-15', type: 'milestone' },
          { title: 'Mood Tracker Streak', date: '2024-01-20', type: 'streak' },
          { title: 'Goal Achievement', date: '2024-01-25', type: 'goal' },
        ],
      };
    }

    return data;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = generateMockData();
    
    if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadFile(blob, `mental-health-data-${new Date().toISOString().split('T')[0]}.json`);
    } else if (exportFormat === 'csv') {
      const csvData = convertToCSV(data);
      const blob = new Blob([csvData], { type: 'text/csv' });
      downloadFile(blob, `mental-health-data-${new Date().toISOString().split('T')[0]}.csv`);
    } else if (exportFormat === 'pdf') {
      // In a real app, you'd generate a PDF here
      const pdfContent = generatePDFContent(data);
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      downloadFile(blob, `mental-health-report-${new Date().toISOString().split('T')[0]}.txt`);
    }
    
    setIsExporting(false);
    setExportComplete(true);
    
    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 2000);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any) => {
    let csv = 'Date,Type,Value,Notes\n';
    
    if (data.moodTracking) {
      data.moodTracking.entries.forEach((entry: any) => {
        csv += `${entry.date},Mood,${entry.mood},"${entry.notes}"\n`;
        csv += `${entry.date},Energy,${entry.energy},""\n`;
        csv += `${entry.date},Anxiety,${entry.anxiety},""\n`;
        csv += `${entry.date},Sleep,${entry.sleep},""\n`;
      });
    }
    
    return csv;
  };

  const generatePDFContent = (data: any) => {
    let content = 'MENTAL HEALTH PROGRESS REPORT\n';
    content += '================================\n\n';
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Data Types: ${selectedDataTypes.join(', ')}\n\n`;
    
    if (data.moodTracking) {
      content += 'MOOD TRACKING SUMMARY\n';
      content += '---------------------\n';
      content += `Total Entries: ${data.moodTracking.totalEntries}\n`;
      content += `Average Mood: ${data.moodTracking.averageMood}/10\n`;
      content += `Trend: ${data.moodTracking.moodTrend}\n\n`;
    }
    
    if (data.mentalHealthGoals) {
      content += 'MENTAL HEALTH GOALS\n';
      content += '-------------------\n';
      data.mentalHealthGoals.goals.forEach((goal: any) => {
        content += `${goal.title}: ${goal.progress}% (${goal.status})\n`;
      });
      content += '\n';
    }
    
    return content;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Export Your Data</h2>
                    <p className="text-blue-100">Download or share your mental health progress</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {exportComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Export Complete!</h3>
                  <p className="text-gray-600">Your data has been successfully exported.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Data Selection */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Data to Export</h3>
                      <div className="space-y-3">
                        {dataTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <label
                              key={type.id}
                              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDataTypes.includes(type.id)}
                                onChange={() => handleDataTypeToggle(type.id)}
                                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">{type.label}</p>
                                <p className="text-sm text-gray-600">{type.description}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Leave empty to export all data</p>
                    </div>
                  </div>

                  {/* Right Column - Export Options */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted report for healthcare providers' },
                          { value: 'csv', label: 'CSV Data', icon: BarChart3, description: 'Spreadsheet format for analysis' },
                          { value: 'json', label: 'JSON Data', icon: FileText, description: 'Raw data for developers' },
                        ].map((format) => {
                          const Icon = format.icon;
                          return (
                            <label
                              key={format.value}
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="format"
                                value={format.value}
                                checked={exportFormat === format.value}
                                onChange={(e) => setExportFormat(e.target.value as any)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">{format.label}</p>
                                <p className="text-sm text-gray-600">{format.description}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Options</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={includePersonalInfo}
                            onChange={(e) => setIncludePersonalInfo(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-900">Include personal information</span>
                        </label>
                        <p className="text-sm text-gray-600 ml-6">
                          Uncheck to anonymize the export (removes name, email, etc.)
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Method</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'download', label: 'Download to Device', icon: Download },
                          { value: 'email', label: 'Email to Healthcare Provider', icon: Mail },
                          { value: 'secure_link', label: 'Generate Secure Link', icon: Cloud },
                        ].map((method) => {
                          const Icon = method.icon;
                          return (
                            <label
                              key={method.value}
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="shareMethod"
                                value={method.value}
                                checked={shareMethod === method.value}
                                onChange={(e) => setShareMethod(e.target.value as any)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{method.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {shareMethod === 'email' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Healthcare Provider Email
                          </label>
                          <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="doctor@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!exportComplete && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedDataTypes.length} data type(s) selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExport}
                      disabled={selectedDataTypes.length === 0 || isExporting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Export Data
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DataExportSystem;
