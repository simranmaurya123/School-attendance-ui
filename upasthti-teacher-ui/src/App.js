import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import UpdateAttendance from './components/UpdateAttendance';
import Notices from './components/Notices';
import ComposeNotice from './components/ComposeNotice';

function App() {
  return (
    <Router>
      <div className="app with-right-panel">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
            <Route path="/update-attendance" element={<UpdateAttendance />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/compose-notice" element={<ComposeNotice />} />
          </Routes>
        </main>
        <RightPanel />
      </div>
    </Router>
  );
}

export default App;