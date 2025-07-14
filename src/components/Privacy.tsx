import React from 'react';
import { Shield, Lock, Heart, UserCheck, Users, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy & Confidentiality</h1>
            <p className="text-lg text-gray-600">
              Your mental health journey is personal. We ensure your privacy and safety at every step.
            </p>
          </div>

          <div className="space-y-12">
            {/* Safe Space Promise */}
            <section className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Safe Space Promise</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We understand the unique privacy needs of women seeking mental health support:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Completely confidential environment for sharing personal experiences</li>
                <li>Protection from gender-based discrimination and harassment</li>
                <li>Secure spaces for discussing sensitive topics</li>
                <li>Control over who can view your information and journey</li>
              </ul>
            </section>

            {/* Confidentiality Measures */}
            <section className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Confidentiality Measures</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Your mental health information is protected by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>End-to-end encryption for all therapy sessions and messages</li>
                <li>Strict access controls for mental health professionals</li>
                <li>Anonymous participation options in group sessions</li>
                <li>Secure handling of sensitive mental health records</li>
              </ul>
            </section>

            {/* Support Network Privacy */}
            <section className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Support Network Privacy</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Control your visibility within our support community:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Choose who can see your participation in support groups</li>
                <li>Private messaging with verified mental health professionals</li>
                <li>Customizable privacy settings for your support circle</li>
                <li>Option to remain anonymous in community discussions</li>
              </ul>
            </section>

            {/* Personal Empowerment */}
            <section className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Personal Empowerment</h2>
              </div>
              <p className="text-gray-600 mb-4">
                You're in control of your mental health journey:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Full control over sharing your mental health experiences</li>
                <li>Choice of female mental health professionals</li>
                <li>Freedom to set boundaries in support relationships</li>
                <li>Right to modify or delete your personal information</li>
              </ul>
            </section>

            {/* Professional Standards */}
            <section className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-4">
                <UserCheck className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Professional Standards</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our mental health professionals maintain strict privacy standards:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Adherence to professional counseling ethics and confidentiality</li>
                <li>Secure handling of therapy session notes and records</li>
                <li>Respect for cultural and personal boundaries</li>
                <li>Clear protocols for emergency situations</li>
              </ul>
            </section>

            {/* Safety Alerts */}
            <section>
              <div className="flex items-center mb-4">
                <Bell className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Safety & Support</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Your safety is our priority:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>24/7 crisis support with complete confidentiality</li>
                <li>Emergency contact options for immediate assistance</li>
                <li>Safe exit button for quick navigation away from the platform</li>
                <li>Regular safety check-ins during your mental health journey</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              Need to discuss privacy concerns? Contact our Women's Mental Health Privacy Officer at{' '}
              <a href="mailto:support@wmhsupport.com" className="text-purple-600 hover:text-purple-500">
                support@wmhsupport.com
              </a>
            </p>
            <p className="text-sm text-gray-500 text-center mt-4">
              In case of emergency, please contact your local emergency services or women's crisis helpline immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
