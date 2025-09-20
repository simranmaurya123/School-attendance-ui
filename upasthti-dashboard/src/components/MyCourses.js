import React, { useState, useEffect } from 'react';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Sample course data - replace with actual API call
    const sampleCourses = [
      {
        id: 1,
        title: 'Mathematics',
        instructor: 'Mahima',
        
        color: '#FF6B6B'
      },
      {
        id: 2,
        title: 'Physics',
        instructor: 'nidhi',
        
       
        color: '#4ECDC4'
      },
      {
        id: 3,
        title: 'Chemistry',
        instructor: 'shreya',
        
        color: '#45B7D1'
      }
    ];
    setCourses(sampleCourses);
  }, []);

  return (
    <div className="my-courses">
      <div className="my-courses-header">
        <h2>My Courses</h2>
        <a href="/courses" className="view-all-link">View All</a>
      </div>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card" style={{ borderLeft: `4px solid ${course.color}` }}>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.instructor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;