import React, { useState } from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();

  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    if (isLogin) {
      login(data.email, data.password);
    } else {
      // Handle registration
      console.log('Register:', data);
      // After successful registration, log in
      login(data.email, data.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to access your support network'
              : 'Join our community of strong women'}
          </p>
        </div>

        <AuthForm
          type={isLogin ? 'login' : 'register'}
          onSubmit={handleSubmit}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-700"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}