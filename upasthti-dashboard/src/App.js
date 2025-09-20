import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/CalendarPage';
import Teachers from './components/Teachers';
import Timetable from './components/Timetable';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;