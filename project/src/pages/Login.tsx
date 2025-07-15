import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      setIsLoading(true);
      const result = await login(email, password);

      if (result.success && result.user) {
        // Navigate based on actual user role from database
        console.log('🎯 User role:', result.user.role);
        console.log('🎯 Full user object:', result.user);

        // Small delay to ensure state is updated
        setTimeout(() => {
          if (result.user.role === 'admin') {
            console.log('🚀 Navigating to admin dashboard');
            navigate('/admin');
          } else {
            console.log('🚀 Navigating to user dashboard');
            navigate('/dashboard');
          }
        }, 100);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (loginType === 'admin') {
        // Admin forgot password
        const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
        if (email === adminCredentials.email) {
          // Generate new password
          const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const updatedCredentials = { ...adminCredentials, password: newPassword };
          localStorage.setItem('admin_credentials', JSON.stringify(updatedCredentials));

          // Simulate email sending
          console.log('📧 Admin password reset email sent:', {
            to: email,
            subject: 'Admin Password Reset - Mental Health Wellness Platform',
            body: `Your new admin password is: ${newPassword}\n\nPlease login with this new password and change it in your admin settings.`
          });

          alert(`Password reset successful! New password sent to ${email}\n\nNew Password: ${newPassword}\n\nPlease save this password and change it after logging in.`);
          setShowForgotPassword(false);
        } else {
          setError('Admin email not found.');
        }
      } else {
        // User forgot password
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userIndex = registeredUsers.findIndex((u: any) => u.email === email);

        if (userIndex !== -1) {
          // Generate new password
          const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          registeredUsers[userIndex].password = newPassword;
          localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

          // Simulate email sending
          console.log('📧 User password reset email sent:', {
            to: email,
            subject: 'Password Reset - Mental Health Wellness Platform',
            body: `Your new password is: ${newPassword}\n\nPlease login with this new password and change it in your profile settings.`
          });

          alert(`Password reset successful! New password sent to ${email}\n\nNew Password: ${newPassword}\n\nPlease save this password and change it after logging in.`);
          setShowForgotPassword(false);
        } else {
          setError('Email not found. Please check your email or sign up for a new account.');
        }
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Login Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginType('user')}
                className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                  loginType === 'user'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" />
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                  loginType === 'admin'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder={loginType === 'admin' ? 'Enter admin email' : 'Enter your email'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder={loginType === 'admin' ? 'Enter admin password' : 'Enter your password'}
            />
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </div>
        </form>

        {/* Sign Up Link - Only for Users */}
        {loginType === 'user' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Sign up as a user
              </Link>
            </p>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reset {loginType === 'admin' ? 'Admin' : 'User'} Password
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a new password.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
