import React from 'react';
import { Navigation } from '../components/layout/Navigation';
import { SimpleChatSupport } from '../components/chat/SimpleChatSupport';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Shield, Users, Phone } from 'lucide-react';

export default function Chat() {
  console.log('📱 Chat page loading...');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />

      <div className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl self-start">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Mental Health Support Chat</h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                24/7 AI-powered support for your mental wellness journey
              </p>
            </div>
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Emotional Support</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Always here to listen</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Crisis Support</h3>
                  <p className="text-sm text-gray-600">Emergency resources</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-sm text-gray-600">Connect with others</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Help</h3>
                  <p className="text-sm text-gray-600">Find therapists</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center"
        >
          <SimpleChatSupport />
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🆘 Crisis Hotlines</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                <p><strong>Emergency Services:</strong> 911</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">💬 Online Therapy</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>• BetterHelp - Professional counseling</p>
                <p>• Talkspace - Text-based therapy</p>
                <p>• Psychology Today - Find therapists</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">📱 Mental Health Apps</h3>
              <div className="text-sm text-purple-800 space-y-1">
                <p>• Headspace - Meditation & mindfulness</p>
                <p>• Calm - Sleep stories & relaxation</p>
                <p>• Sanvello - Anxiety & mood tracking</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
