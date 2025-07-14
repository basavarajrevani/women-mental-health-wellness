import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  MousePointer,
  Keyboard,
  Settings,
  X,
  Check,
  Minus,
  Plus,
  RotateCcw,
  Palette,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number; // 12-24px
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
  darkMode: boolean;
  focusIndicators: boolean;
  textToSpeech: boolean;
  dyslexiaFont: boolean;
}

const AccessibilityFeatures: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    colorBlindFriendly: false,
    darkMode: false,
    focusIndicators: true,
    textToSpeech: false,
    dyslexiaFont: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    applySettings(settings);
    localStorage.setItem('accessibility_settings', JSON.stringify(settings));
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--base-font-size', `${newSettings.fontSize}px`);
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Dark mode
    if (newSettings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Color blind friendly
    if (newSettings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }
    
    // Dyslexia font
    if (newSettings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }
    
    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      colorBlindFriendly: false,
      darkMode: false,
      focusIndicators: true,
      textToSpeech: false,
      dyslexiaFont: false,
    };
    setSettings(defaultSettings);
  };

  const speakText = (text: string) => {
    if (settings.textToSpeech && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;
      
      // Alt + A to open accessibility menu
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(true);
        speakText('Accessibility menu opened');
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        speakText('Accessibility menu closed');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, isOpen]);

  return (
    <>
      {/* Accessibility Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          speakText(isOpen ? 'Accessibility menu closed' : 'Accessibility menu opened');
        }}
        className="fixed bottom-6 left-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        aria-label="Open accessibility settings"
        title="Accessibility Settings (Alt + A)"
      >
        <Accessibility className="h-6 w-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-describedby="accessibility-description"
            >
              {/* Header */}
              <div className="bg-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Accessibility className="h-8 w-8" />
                    <div>
                      <h2 id="accessibility-title" className="text-2xl font-bold">
                        Accessibility Settings
                      </h2>
                      <p id="accessibility-description" className="text-purple-100">
                        Customize your experience for better accessibility
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    aria-label="Close accessibility settings"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visual Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Visual
                    </h3>

                    {/* Font Size */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Font Size: {settings.fontSize}px
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                          aria-label="Decrease font size"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={settings.fontSize}
                          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                          className="flex-1"
                          aria-label="Font size slider"
                        />
                        <button
                          onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                          aria-label="Increase font size"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* High Contrast */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Contrast className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">High Contrast</span>
                          <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => updateSetting('highContrast', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        aria-describedby="high-contrast-desc"
                      />
                    </label>

                    {/* Dark Mode */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Moon className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Dark Mode</span>
                          <p className="text-sm text-gray-600">Reduce eye strain in low light</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => updateSetting('darkMode', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Color Blind Friendly */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Color Blind Friendly</span>
                          <p className="text-sm text-gray-600">Use patterns and shapes alongside colors</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.colorBlindFriendly}
                        onChange={(e) => updateSetting('colorBlindFriendly', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Dyslexia Font */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Type className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Dyslexia-Friendly Font</span>
                          <p className="text-sm text-gray-600">Use OpenDyslexic font for easier reading</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.dyslexiaFont}
                        onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  </div>

                  {/* Interaction Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MousePointer className="h-5 w-5" />
                      Interaction
                    </h3>

                    {/* Reduced Motion */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RotateCcw className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Reduced Motion</span>
                          <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Keyboard Navigation */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Keyboard className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Enhanced Keyboard Navigation</span>
                          <p className="text-sm text-gray-600">Improve keyboard accessibility</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.keyboardNavigation}
                        onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Focus Indicators */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Enhanced Focus Indicators</span>
                          <p className="text-sm text-gray-600">Make focus outlines more visible</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.focusIndicators}
                        onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Text to Speech */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Text-to-Speech</span>
                          <p className="text-sm text-gray-600">Enable audio feedback for actions</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.textToSpeech}
                        onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>

                    {/* Screen Reader Support */}
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900">Screen Reader Optimized</span>
                          <p className="text-sm text-gray-600">Enhanced ARIA labels and descriptions</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.screenReader}
                        onChange={(e) => updateSetting('screenReader', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>• Alt + A: Open accessibility menu</div>
                    <div>• Tab: Navigate between elements</div>
                    <div>• Enter/Space: Activate buttons</div>
                    <div>• Escape: Close modals/menus</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={resetSettings}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Defaults
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityFeatures;
