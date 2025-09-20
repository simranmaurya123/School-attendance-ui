import React from 'react';
import '../style.css';
import '../components/sidebar.css';
import '../components/timetable.css';
import Sidebar from './Sidebar';

const Timetable = () => {
  const timeSlots = [
    '8:00 to 8:50',
    '8:50 to 9:40', 
    '9:40 to 10:30',
    '10:30 to 11:20',
    '11:20 to 12:10',
    '12:10 to 13:00'
  ];

  const schedule = {
    Monday: ['English', 'Hindi', 'Science', 'Information Technology', 'Science', 'Maths'],
    Tuesday: ['English', 'Science', 'Maths', 'Science', 'Social studies', ''],
    Wednesday: ['Maths', 'Science', 'Information Technology', 'English', 'Hindi', ''],
    Thursday: ['PT', 'Maths', 'Science', 'Hindi', 'English', ''],
    Friday: ['Science', 'English', 'Hindi', 'Maths', 'Information Technology', ''],
    Saturday: ['', '', '', '', '', ''],
    Sunday: ['', '', '', '', '', '']
  };

  const getSubjectClass = (subject) => {
    const subjectClasses = {
      'English': 'cs',
      'Hindi': 'math',
      'Science': 'physics',
      'Information Technology': 'cs',
      'Maths': 'math',
      'Social studies': 'cs',
      'PT': 'cs'
    };
    return subjectClasses[subject] || 'empty-slot';
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="page-header">
          <nav className="breadcrumb">
            <a href="/">🏠 Home</a>
            <span>›</span>
            <span>Time Table</span>
          </nav>
        </header>

        <section className="timetable-content">
          <div className="timetable-header">
            <h1>TIME TABLE</h1>
          </div>

          <div className="timetable-container">
            <div className="timetable-grid">
              {/* Time Slots Header */}
              <div className="time-header"></div>
              {timeSlots.map((time, index) => (
                <div key={index} className="time-slot">{time}</div>
              ))}

              {/* Days and Subjects */}
              {Object.entries(schedule).map(([day, subjects]) => (
                <React.Fragment key={day}>
                  <div className="day-label"> {day}</div>
                  {subjects.map((subject, index) => (
                    <div key={index} className={subject ? `subject-card ${getSubjectClass(subject)}` : 'empty-slot'}>
                      {subject && (
                        <div className="subject-code">{subject}</div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Timetable;