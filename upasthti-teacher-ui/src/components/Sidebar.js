import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    {
      section: 'Home',
      items: [
        { path: '/', icon: 'fas fa-tachometer-alt', label: 'Dashboard' }
      ]
    },
    {
      section: 'Attendance',
      items: [
        { path: '/mark-attendance', icon: 'fas fa-user-check', label: 'Mark Attendance' },
        { path: '/update-attendance', icon: 'fas fa-edit', label: 'Update Attendance' }
      ]
    },
    {
      section: 'Communication',
      items: [
        { path: '/notices', icon: 'fas fa-bullhorn', label: 'Notices' },
        { path: '/compose-notice', icon: 'fas fa-pen', label: 'Compose Notice' }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-book book-icon"></i>
          </div>
          <div className="logo-text">
            <span className="english">UPAS</span>
            <span className="hindi">थिति</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map((section, index) => (
          <div key={index} className="nav-section">
            <h3 className="section-title">{section.section}</h3>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;