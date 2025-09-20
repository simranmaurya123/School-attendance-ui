import React, { useState, useEffect } from 'react';
import './calendar.css';

const Calendar = () => {
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
    
    // Sample attendance data - replace with actual API call
    const attendanceData = {
      
      '2025-09-01': 'present',  // Monday (1) - green
      '2025-09-02': 'present',  // Tuesday (2) - green
      '2025-09-03': 'present',  // Wednesday (3) - green  
      '2025-09-04': 'absent',   // Thursday (4) - red
      '2025-09-05': 'present',  // Friday (5) - green
      
      
      
      '2025-09-08': 'present',  // Monday (8) - green
      '2025-09-09': 'present',  // Tuesday (9) - green
      '2025-09-10': 'absent',   // Wednesday (10) - red
      '2025-09-11': 'absent',   // Thursday (11) - red
      '2025-09-12': 'present',  // Friday (12) - green
      
      '2025-09-15': 'present',  // Monday (15) - green
      '2025-09-16': 'absent',   // Tuesday (16) - red
      '2025-09-17': 'present',  // Wednesday (17) - green
      '2025-09-18': 'present',  // Thursday (18) - green
      '2025-09-19': 'present',  // Friday (19) - green
      // 20 is today (current date - blue)
      // 21 is Sunday (no school)
      
      // Week 4 (Sept 22-28)
      '2025-09-22': 'present',  // Monday (22) - green
      
    };
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateKey = current.toISOString().split('T')[0];
      const dayData = {
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        attendance: attendanceData[dateKey] || null
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
    <div className="dashboard-calendar-widget">
      <div className="dashboard-calendar-container">
        <div className="dashboard-calendar-header">
          <button onClick={() => navigateMonth(-1)}>❮</button>
          <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => navigateMonth(1)}>❯</button>
        </div>
        
        <div className="dashboard-calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="dashboard-calendar-weekday">{day}</div>
          ))}
          {calendarDays.map((day, index) => {
            const attendanceClass = day.attendance || '';
            const isCurrentMonth = day.isCurrentMonth ? '' : 'other-month';
            const isToday = day.isToday ? 'today' : '';
            
            return (
              <div 
                key={index} 
                className={`dashboard-calendar-day ${isCurrentMonth} ${isToday} ${attendanceClass}`.trim()}
                title={`${day.date.toDateString()}${day.attendance ? ` - ${day.attendance}` : ''}`}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;