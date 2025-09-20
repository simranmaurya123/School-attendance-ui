import React from 'react';
import '../style.css';
import '../components/dashboard.css';
import '../components/sidebar.css';
import '../components/courses.css';
import '../components/courses-list.css';
import '../components/profile.css';
import '../components/notifications.css';
import Sidebar from './Sidebar';
import Header from './Header';
import MyCourses from './MyCourses';
import Calendar from './Calendar';
import NoticeSection from './NoticeSection';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <Header />
        
        <section className="dashboard-content">
          <div className="main-content-area">
            <MyCourses />
          </div>
          
          <div className="side-content">
            <Calendar />
            <NoticeSection />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;