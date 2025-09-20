import React, { useState, useEffect } from 'react';
import '../style.css';
import '../components/sidebar.css';
import '../components/calendar-page.css';
import Sidebar from './Sidebar';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayData = {
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString()
      };
      days.push(dayData);
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="page-header">
          <nav className="breadcrumb">
            <a href="/">🏠 Home</a>
            <span>›</span>
            <span>Calendar</span>
          </nav>
        </header>

        <section className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-title">
              <h1> My Calendar</h1>
            </div>
            <div className="calendar-controls">
              <button className="nav-btn prev-month" onClick={() => navigateMonth(-1)}>❮</button>
              <button className="nav-btn next-month" onClick={() => navigateMonth(1)}>❯</button>
            </div>
          </div>

          <div className="calendar-container">
            <div className="calendar-month-year">
              <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            </div>
            
            <div className="calendar-grid">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                >
                  <div className="date-number">
                    {day.date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CalendarPage;