import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Mental Health Support
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your journey to better mental health starts here. Join our supportive community and get access to professional help, resources, and tools for your well-being.
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-lg"
            onClick={() => navigate('/login')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 bg-white/50">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Heart className="w-12 h-12 text-pink-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Emotional Support</h3>
            <p className="text-gray-600 leading-relaxed">Access resources and connect with professionals who understand and care about your mental well-being.</p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Shield className="w-12 h-12 text-purple-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Safe Space</h3>
            <p className="text-gray-600 leading-relaxed">A secure and confidential environment where you can express yourself without judgment or fear.</p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Users className="w-12 h-12 text-blue-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Community</h3>
            <p className="text-gray-600 leading-relaxed">Join a supportive community of people who share similar experiences and understand your journey.</p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Take the first step towards better mental health today. Our community and professionals are here to support you every step of the way.
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-lg"
            onClick={() => navigate('/login')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join Now
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <Link to="/privacy" className="hover:text-purple-600 transition-colors">
            Privacy Policy
          </Link>
          <span className="mx-2">•</span>
          <span> 2024 Mental Health Support. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;