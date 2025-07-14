import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaHeartbeat, 
  FaBook, 
  FaCalendarAlt, 
  FaComments, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/wellness-tracker', name: 'Wellness Tracker', icon: <FaHeartbeat /> },
    { path: '/resources', name: 'Resources', icon: <FaBook /> },
    { path: '/appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/community', name: 'Community', icon: <FaComments /> },
  ];

  return (
    <>
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Women Wellness</h2>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} onClick={() => setIsOpen(false)}>
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
