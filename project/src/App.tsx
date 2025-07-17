import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import { AdminProvider } from './context/AdminContext';
import { GlobalDataProvider } from './context/GlobalDataContext';
import { GlobalProvider } from './contexts/GlobalContext';
import AccessibilityFeatures from './components/AccessibilityFeatures';
import DataInitializer from './components/DataInitializer';
import { Navigation } from './components/layout/Navigation';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import { Auth } from './pages/Auth';
import Login from './pages/Login';
import Register from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import Resources from './pages/Resources';
import Community from './pages/Community';
import SocketTest from './pages/SocketTest';
import Chat from './pages/Chat';
import Progress from './pages/Progress';
import Partners from './pages/Partners';
import NGOs from './pages/NGOs';
import MedicalSupport from './pages/MedicalSupport';
import Privacy from './pages/Privacy';
import HealthTracker from './pages/HealthTracker';
import MentalWellness from './pages/MentalWellness';
import ContactUs from './pages/ContactUs';
import Signup from './pages/Signup';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  console.log('🔒 ProtectedRoute check:', {
    hasUser: !!user,
    isLoading,
    userEmail: user?.email
  });

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user after loading is complete
  if (!user) {
    console.log('❌ No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('✅ User authenticated, allowing access');
  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();

  console.log('🔒 ProtectedAdminRoute check:', {
    hasUser: !!user,
    userRole: user?.role,
    isAdminResult: isAdmin(),
    userEmail: user?.email,
    fullUser: user
  });

  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    console.log('❌ User is not admin, redirecting to dashboard');
    console.log('❌ User role:', user.role);
    console.log('❌ User object:', user);
    console.log('❌ isAdmin() result:', isAdmin());
    return <Navigate to="/dashboard" />;
  }

  console.log('✅ Admin access granted for user:', user.email);
  return <>{children}</>;
}

// Layout for authenticated pages (dashboard and related pages)
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />
      <div className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-6 min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Layout for public pages (home, login, register)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {children}
    </div>
  );
}

function AppContent() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout>
          <LandingPage />
        </PublicLayout>
      } />

      <Route path="/home" element={
        <PublicLayout>
          {user ? <Navigate to="/dashboard" /> : <Home />}
        </PublicLayout>
      } />

      <Route path="/auth" element={
        <PublicLayout>
          {user ? <Navigate to="/dashboard" /> : <Auth />}
        </PublicLayout>
      } />

      <Route path="/login" element={
        <PublicLayout>
          {user ? <Navigate to="/dashboard" /> : <Login />}
        </PublicLayout>
      } />

      <Route path="/signup" element={
        <PublicLayout>
          {user ? <Navigate to="/dashboard" /> : <Signup />}
        </PublicLayout>
      } />
      
      <Route path="/register" element={
        <PublicLayout>
          {user ? <Navigate to="/dashboard" /> : <Register />}
        </PublicLayout>
      } />
      
      <Route path="/privacy" element={
        <PublicLayout>
          <Privacy />
        </PublicLayout>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/health-tracker" element={
        <ProtectedRoute>
          <DashboardLayout>
            <HealthTracker />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/mental-wellness" element={
        <ProtectedRoute>
          <DashboardLayout>
            <MentalWellness />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/resources" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Resources />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/community" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Community />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/socket-test" element={
        <ProtectedRoute>
          <DashboardLayout>
            <SocketTest />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/chat" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Chat />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/progress" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Progress />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/partners" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Partners />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/ngos" element={
        <ProtectedRoute>
          <DashboardLayout>
            <NGOs />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/medical-support" element={
        <ProtectedRoute>
          <DashboardLayout>
            <MedicalSupport />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/contact-us" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ContactUs />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Catch all route - redirect based on user role */}
      <Route path="*" element={
        <Navigate to={
          user ? (isAdmin() ? "/admin" : "/dashboard") : "/"
        } replace />
      } />
    </Routes>
  );
}

function App() {
  // Aggressive notification cleanup on app start
  React.useEffect(() => {
    console.log('🧹 App starting - clearing all notification data...');

    // Clear ALL notification-related localStorage keys
    const allKeys = Object.keys(localStorage);
    const notificationKeys = allKeys.filter(key =>
      key.includes('notification') ||
      key.includes('mood') ||
      key.includes('last_sent') ||
      key.includes('reminder') ||
      key.includes('last_mood_track') ||
      key.includes('breathing') ||
      key.includes('wellness') ||
      key.includes('smart_') ||
      key.includes('timer_') ||
      key.includes('alert_') ||
      key.includes('popup_') ||
      key.includes('auto_')
    );

    notificationKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ App cleanup - removed:', key);
    });

    console.log('✅ App notification cleanup complete');
  }, []);

  return (
    <AuthProvider>
      <UserDataProvider>
        <AdminProvider>
          <GlobalDataProvider>
            <GlobalProvider>
              <Router>
                <AppContent />
                <AccessibilityFeatures />
              </Router>
            </GlobalProvider>
          </GlobalDataProvider>
        </AdminProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;