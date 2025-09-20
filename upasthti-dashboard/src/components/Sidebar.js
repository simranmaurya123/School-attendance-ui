import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/calendar', icon: '📅', label: 'Calendar' },
    { path: '/teachers', icon: '👩‍🏫', label: 'Teachers' },
    { path: '/timetable', icon: '🗓️', label: 'Time Table' }
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>Upasthiti</h2>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;