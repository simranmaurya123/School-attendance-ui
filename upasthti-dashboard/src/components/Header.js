import React, { useState, useRef, useEffect } from 'react';
import './notifications.css';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const notifications = [
    {
      id: 1,
      icon: '📢',
      title: 'Mid-term Exam Schedule',
      content: 'Mid-term exams will start from 20th September. Check your timetable for detailed schedule.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      icon: '📄',
      title: 'Project Submission Reminder',
      content: 'All project submissions are due by 18th September. Late submissions will not be accepted.',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Sports Meet Registration',
      content: 'Annual sports meet registration is now open. Register before 25th September.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 4,
      icon: '📚',
      title: 'Library Maintenance',
      content: 'Library will be closed on 15th September for maintenance work.',
      time: '2 days ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Left side content if needed */}
      </div>
      <div className="header-actions">
        <div className="notification-container" ref={notificationRef}>
          <button 
            className="notification-bell" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notification-popup">
              <div className="notification-header">
                <h4>Circulars & Notifications</h4>
              </div>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">{notification.icon}</div>
                    <div className="notification-content">
                      <h5>{notification.title}</h5>
                      <p>{notification.content}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="profile-section">
          <img src="/avatar.jpg" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <span className="profile-name">Kabir Mehra</span>
            <span className="verified-badge">✓</span>
            <span className="profile-designation">A021191</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;