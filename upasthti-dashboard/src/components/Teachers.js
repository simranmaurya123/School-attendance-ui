import React, { useState, useEffect } from 'react';
import '../style.css';
import '../components/sidebar.css';
import '../components/teachers.css';
import '../components/notifications.css';
import Sidebar from './Sidebar';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Sample teachers data - replace with actual API call
    const sampleTeachers = [
      {
        id: 1,
        name: 'Mahima Chabbra',
        subject: 'Mathematics',
        email: 'mahima.chabbra@school.edu',
        phone: '+91 9328198133',
       
      },
      {
        id: 2,
        name: 'Nidhi Sharma',
        subject: 'Physics',
        email: 'nidhi.sharma@school.edu',
        phone: '+91 9328194134',
        
      },
      {
        id: 3,
        name: 'vijay kumar',
        subject: 'Chemistry',
        email: 'vijay.kumar@school.edu',
        phone: '+91 9326194135',
        
      },
      {
        id: 4,
        name: 'sarah',
        subject: 'English',
        email: 'sarah.m@school.edu',
        phone: '+91 9328598136',
       
      },
      {
        id: 5,
        name: 'Kanika Sharma',
        subject: 'History',
        email: 'kanika.sharma@school.edu',
        phone: '+91 9438598137',
       
      },
      {
        id: 6,
        name: 'Sagar',
        subject: 'Biology',
        email: 'sagar@school.edu',
        phone: '+91 9326194135',
        
      }
    ];
    setTeachers(sampleTeachers);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="dashboard-header">
        </header>

        <section className="teachers-content">
          <div className="teachers-header">
            <h1>Faculty Members</h1>
            <p>Get in touch with your teachers and faculty members</p>
          </div>

          <div className="teachers-list">
            {teachers.map(teacher => (
              <div key={teacher.id} className="teacher-bar">
                <div className="teacher-details">
                  <div className="teacher-info-stack">
                    <div className="teacher-name-row">
                      <h3 className="teacher-name">{teacher.name}</h3>
                      <span className="teacher-subject">{teacher.subject}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Email:</span>
                      <span className="contact-value">{teacher.email}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Phone:</span>
                      <span className="contact-value">{teacher.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Teachers;