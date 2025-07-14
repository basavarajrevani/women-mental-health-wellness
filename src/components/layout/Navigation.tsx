import React, { useState, useEffect } from 'react';
import { Home, Heart, BookOpen, Users, MessageCircle, LineChart, Building2, Shield, LogOut, Handshake, Activity, Calendar, Brain, User, Mail, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from '../UserProfile';

export function Navigation() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-nav') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <Heart className="text-purple-600" size={24} />
            <span className="text-xl font-semibold text-gray-900">WomenWell</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6 z-30">
        <div
          className="flex items-center space-x-2 mb-8 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <Heart className="text-purple-600" size={24} />
          <span className="text-xl font-semibold text-gray-900">WomenWell</span>
        </div>

        <div className="space-y-4">
        <NavItem 
          icon={<Home size={20} />} 
          label="Health Tracker" 
          path="/health-tracker"
          isActive={location.pathname === '/health-tracker'}
        />
        <NavItem 
          icon={<BookOpen size={20} />} 
          label="Resources" 
          path="/resources"
          isActive={location.pathname === '/resources'}
        />
        <NavItem 
          icon={<Users size={20} />} 
          label="Community" 
          path="/community"
          isActive={location.pathname === '/community'}
        />
        <NavItem 
          icon={<MessageCircle size={20} />} 
          label="Support Chat" 
          path="/chat"
          isActive={location.pathname === '/chat'}
        />
        <NavItem 
          icon={<LineChart size={20} />} 
          label="Progress" 
          path="/progress"
          isActive={location.pathname === '/progress'}
        />
        <NavItem 
          icon={<Building2 size={20} />} 
          label="Partners" 
          path="/partners"
          isActive={location.pathname === '/partners'}
        />
        <NavItem 
          icon={<Handshake size={20} />} 
          label="NGOs" 
          path="/ngos"
          isActive={location.pathname === '/ngos'}
        />
        <NavItem 
          icon={<Activity size={20} />} 
          label="Medical Support" 
          path="/medical-support"
          isActive={location.pathname === '/medical-support'}
        />
        <NavItem 
          icon={<Brain size={20} />} 
          label="Mental Wellness" 
          path="/mental-wellness"
          isActive={location.pathname === '/mental-wellness'}
        />
        <NavItem 
          icon={<Shield size={20} />} 
          label="Privacy" 
          path="/privacy"
          isActive={location.pathname === '/privacy'}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 Profile button clicked');
            setShowProfile(true);
          }}
          className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 mt-8 p-2 rounded-lg hover:bg-purple-50 transition-colors relative z-10"
          style={{ pointerEvents: 'auto' }}
        >
          <User size={20} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => {
            console.log('📧 Contact Us clicked - navigating to /contact-us');
            navigate('/contact-us');
          }}
          className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <Mail size={20} />
          <span>Contact Us</span>
        </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </nav>

      {/* Mobile Sidebar */}
      <nav className={`mobile-nav lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-4">
            <NavItem
              icon={<Home size={20} />}
              label="Health Tracker"
              path="/health-tracker"
              isActive={location.pathname === '/health-tracker'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<BookOpen size={20} />}
              label="Resources"
              path="/resources"
              isActive={location.pathname === '/resources'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Community"
              path="/community"
              isActive={location.pathname === '/community'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<MessageCircle size={20} />}
              label="Support Chat"
              path="/chat"
              isActive={location.pathname === '/chat'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<LineChart size={20} />}
              label="Progress"
              path="/progress"
              isActive={location.pathname === '/progress'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Building2 size={20} />}
              label="Partners"
              path="/partners"
              isActive={location.pathname === '/partners'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Handshake size={20} />}
              label="NGOs"
              path="/ngos"
              isActive={location.pathname === '/ngos'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Activity size={20} />}
              label="Medical Support"
              path="/medical-support"
              isActive={location.pathname === '/medical-support'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Brain size={20} />}
              label="Mental Wellness"
              path="/mental-wellness"
              isActive={location.pathname === '/mental-wellness'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              icon={<Shield size={20} />}
              label="Privacy"
              path="/privacy"
              isActive={location.pathname === '/privacy'}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowProfile(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 mt-8 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <User size={20} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                navigate('/contact-us');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Mail size={20} />
              <span>Contact Us</span>
            </button>

            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavItem({
  icon,
  label,
  path,
  isActive,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`🔗 NavItem clicked: ${label} -> ${path}`);
        navigate(path);
        onClick?.();
      }}
      className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors text-left ${
        isActive
          ? 'text-purple-600 bg-purple-50'
          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}