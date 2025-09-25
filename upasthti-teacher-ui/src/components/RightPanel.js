import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RightPanel.css';

const RightPanel = () => {
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());



  const generateCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {prevMonthDay.getDate()}
        </div>
      );
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = 
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate();
      
      const isSelected = 
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth() &&
        day === selectedDate.getDate();
      
      const dayClasses = `calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
      
      days.push(
        <div 
          key={day} 
          className={dayClasses}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(calendarDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
    
    // If the new date is in a different month, update calendar view
    if (newDate.getMonth() !== calendarDate.getMonth() || newDate.getFullYear() !== calendarDate.getFullYear()) {
      setCalendarDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  };

  const getMonthYearString = () => {
    return calendarDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getSelectedDateString = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <aside className="right-panel">
      {/* Teacher Profile Section */}
      <section className="profile-section">
        <div className="profile-card">
          <div className="account-badge">Teacher Account</div>
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src="/teacher-profile.png" 
                alt="Teacher Profile" 
                className="profile-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="profile-icon" style={{display: 'none'}}>
                <i className="fas fa-user-tie"></i>
              </div>
            </div>
            <div className="profile-details">
              <h4 className="teacher-name">Richa Sharma</h4>
              <p className="teacher-id">ID: T012191</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Calendar Section */}
      <section className="calendar-section">
        <div className="calendar-card">
          {/* Month Navigation */}
          <div className="calendar-header">
            <h4>{getMonthYearString()}</h4>
            <div className="calendar-nav-buttons">
              <button 
                className="calendar-nav" 
                onClick={() => navigateMonth(-1)}
                title="Previous Month"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="calendar-nav" 
                onClick={() => navigateMonth(1)}
                title="Next Month"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>
            
            <div className="calendar-days">
              {generateCalendar()}
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightPanel;