import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'New attendance features have been added to the system',
      time: '2 hours ago',
      icon: 'fas fa-info-circle'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Class Reminder',
      message: "Don't forget to mark attendance for Class 10-A today",
      time: '5 hours ago',
      icon: 'fas fa-exclamation-triangle'
    },
    {
      id: 3,
      type: 'calendar',
      title: 'Schedule Change',
      message: 'Mathematics class for 9-B has been rescheduled to 11:00 AM',
      time: '1 day ago',
      icon: 'fas fa-calendar'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const todayClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      class: 'Class 10-A',
      time: '08:15 - 09:00',
      status: 'active'
    },
    {
      id: 2,
      subject: 'Mathematics',
      class: 'Class 9-B',
      time: '09:00 - 09:45',
      status: 'active'
    },
    {
      id: 3,
      subject: 'Mathematics',
      class: 'Class 8-C',
      time: '09:45 - 10:30',
      status: 'active'
    },
    {
      id: 4,
      subject: 'Mathematics',
      class: 'Class 9-A',
      time: '10:30 - 11:15',
      status: 'active'
    }
  ];

  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Record student attendance for today\'s classes',
      icon: 'fas fa-user-check',
      color: 'success',
      path: '/mark-attendance'
    },
    {
      title: 'Update Attendance',
      description: 'Modify existing attendance records',
      icon: 'fas fa-edit',
      color: 'warning',
      path: '/update-attendance'
    },
    {
      title: 'Notice',
      description: 'Create and manage notices for students',
      icon: 'fas fa-bullhorn',
      color: 'info',
      path: '/notices'
    }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Teacher Dashboard</h1>
          <p>Welcome back, Richa Sharma</p>
        </div>
        <div className="header-right">
          <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
            <i className="fas fa-bell"></i>
            <span className="notification-badge">{notifications.length}</span>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <span className="notification-count">({notifications.length})</span>
                </div>
                <div className="notification-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-icon">
                        <i className={notification.icon}></i>
                      </div>
                      <div className="notification-content">
                        <h5>{notification.title}</h5>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <a href="#" className="view-all-notifications">View All Notifications</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className={`action-card ${action.color}`}>
              <div className="action-icon">
                <i className={action.icon}></i>
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Classes */}
      <section className="todays-classes">
        <h2>Today's Classes</h2>
        <div className="classes-container">
          <div className="date-header">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="classes-list">
            {todayClasses.map(classItem => (
              <div key={classItem.id} className="class-item">
                <div className="time-slot">
                  <span className="time-range">{classItem.time}</span>
                </div>
                <div className="class-details">
                  <div className={`status-indicator ${classItem.status}`}></div>
                  <div className="class-info">
                    <h4 className="subject-name">{classItem.subject}</h4>
                    <p className="class-name">{classItem.class}</p>
                  </div>
                </div>
                <div className="class-actions">
                  <Link to="/mark-attendance" className="btn btn-sm btn-primary">
                    Mark Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;