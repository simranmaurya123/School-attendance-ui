import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const classes = [
    { id: 'class_10a_math', name: 'Class 10-A Mathematics', subject: 'Mathematics' },
    { id: 'class_10b_math', name: 'Class 10-B Mathematics', subject: 'Mathematics' },
    { id: 'class_9a_math', name: 'Class 9-A Mathematics', subject: 'Mathematics' },
    { id: 'class_9b_math', name: 'Class 9-B Mathematics', subject: 'Mathematics' }
  ];

  const allStudentsData = {
    'class_10a_math': [
      { id: 1, name: 'Niya Sharma', rollNumber: '10A001', email: 'niya@school.edu' },
      { id: 2, name: 'Pranav', rollNumber: '10A002', email: 'pranav@school.edu' },
      { id: 3, name: 'Paridhi Balodhi', rollNumber: '10A003', email: 'paridhi@school.edu' },
      { id: 4, name: 'Nandika Gupta', rollNumber: '10A004', email: 'nandika@school.edu' },
      { id: 5, name: 'Suraj Bhan Rawat', rollNumber: '10A005', email: 'suraj@school.edu' },
      { id: 6, name: 'Shreya', rollNumber: '10A006', email: 'shreya@school.edu' },
      { id: 7, name: 'Maira', rollNumber: '10A007', email: 'maira@school.edu' },
      { id: 8, name: 'Siya', rollNumber: '10A008', email: 'siya@school.edu' },
      { id: 9, name: 'Sania Malik', rollNumber: '10A009', email: 'sania@school.edu' },
      { id: 10, name: 'Simran Maurya', rollNumber: '10A010', email: 'simran@school.edu' }
    ],
    'class_10b_math': [
      { id: 1, name: 'Mahima', rollNumber: '10B001', email: 'mahima@school.edu' },
      { id: 2, name: 'Raj', rollNumber: '10B002', email: 'raj@school.edu' },
      { id: 3, name: 'Vivek', rollNumber: '10B003', email: 'vivek@school.edu' },
      { id: 4, name: 'Riya', rollNumber: '10B004', email: 'riya@school.edu' },
      { id: 5, name: 'Nysa', rollNumber: '10B005', email: 'nysa@school.edu' }
    ]
  };

  useEffect(() => {
    if (selectedClass) {
      const students = allStudentsData[selectedClass.id] || [];
      setStudentsData(students);
      
      // Initialize attendance data
      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student.id] = 'pending';
      });
      setAttendanceData(initialAttendance);
    }
  }, [selectedClass]);

  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllAttendance = (status) => {
    const newAttendanceData = {};
    studentsData.forEach(student => {
      newAttendanceData[student.id] = status;
    });
    setAttendanceData(newAttendanceData);
  };

  const getAttendanceStats = () => {
    const values = Object.values(attendanceData);
    return {
      present: values.filter(status => status === 'present').length,
      absent: values.filter(status => status === 'absent').length,
      leave: values.filter(status => status === 'leave').length,
      pending: values.filter(status => status === 'pending').length
    };
  };

  const saveAttendance = async () => {
    const stats = getAttendanceStats();
    if (stats.pending > 0) {
      if (!window.confirm(`${stats.pending} student(s) are still pending. Do you want to save anyway?`)) {
        return;
      }
    }

    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      const attendanceRecord = {
        classId: selectedClass.id,
        className: selectedClass.name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toISOString(),
        attendance: attendanceData,
        summary: {
          total: studentsData.length,
          ...stats,
          rate: Math.round((stats.present / studentsData.length) * 100)
        }
      };

      // Save to localStorage (in real app, this would be sent to server)
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      existingRecords.push(attendanceRecord);
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));

      setSaving(false);
      alert('Attendance saved successfully!');
    }, 2000);
  };

  const stats = getAttendanceStats();

  if (!selectedClass) {
    return (
      <div className="mark-attendance">
        <div className="breadcrumb-container">
          <div className="breadcrumb-box" onClick={() => navigate('/')}>
            <span>Home → Mark Attendance</span>
          </div>
        </div>

        <div className="class-selection">
          <h1>Select Class</h1>
          <p>Choose a class to mark attendance</p>
          
          <div className="class-grid">
            {classes.map(classItem => (
              <div 
                key={classItem.id} 
                className="class-card"
                onClick={() => setSelectedClass(classItem)}
              >
                <div className="class-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>{classItem.name}</h3>
                <p>{classItem.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mark-attendance">
      <div className="breadcrumb-container">
        <div className="breadcrumb-box" onClick={() => setSelectedClass(null)}>
          <span>Home → Mark Attendance → {selectedClass.name}</span>
        </div>
      </div>

      <div className="attendance-header">
        <div className="class-info">
          <button 
            className="back-button"
            onClick={() => setSelectedClass(null)}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Classes
          </button>
          <h1>{selectedClass.name}</h1>
          <div className="class-meta">
            <span>{new Date().toLocaleDateString()}</span>
            <span>Total Students: {studentsData.length}</span>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="controls-header">
          <input
            type="text"
            className="search-box"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="bulk-actions">
            <button className="btn btn-success" onClick={() => markAllAttendance('present')}>
              Mark All Present
            </button>
            <button className="btn btn-danger" onClick={() => markAllAttendance('absent')}>
              Mark All Absent
            </button>
            <button className="btn btn-warning" onClick={() => markAllAttendance('leave')}>
              Mark All Leave
            </button>
            <button className="btn btn-secondary" onClick={() => markAllAttendance('pending')}>
              Clear All
            </button>
          </div>
        </div>

        <div className="attendance-stats">
          <div className="stat-card present">
            <span className="stat-number">{stats.present}</span>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat-card absent">
            <span className="stat-number">{stats.absent}</span>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat-card leave">
            <span className="stat-number">{stats.leave}</span>
            <div className="stat-label">Leave</div>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">{stats.pending}</span>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      <div className="students-list">
        {filteredStudents.map(student => {
          const currentStatus = attendanceData[student.id] || 'pending';
          return (
            <div key={student.id} className="student-item">
              <div className="student-avatar">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="student-info">
                <div className="student-name">{student.name}</div>
                <div className="student-details">
                  <span>{student.rollNumber}</span>
                  <span>{student.email}</span>
                </div>
              </div>
              <div className="attendance-actions">
                {/* Present Button - Green Circle with P */}
                <button
                  className={`attendance-btn present ${currentStatus === 'present' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'present')}
                  title="Mark Present"
                  type="button"
                >
                  P
                </button>
                
                {/* Leave Button - Orange Circle with L */}
                <button
                  className={`attendance-btn leave ${currentStatus === 'leave' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'leave')}
                  title="Mark Leave"
                  type="button"
                >
                  L
                </button>
                
                {/* Absent Button - Red Circle with A */}
                <button
                  className={`attendance-btn absent ${currentStatus === 'absent' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'absent')}
                  title="Mark Absent"
                  type="button"
                >
                  A
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="save-section">
        <div className="save-status">
          {stats.pending > 0 ? (
            <span style={{color: 'var(--danger)'}}>{stats.pending} student(s) pending</span>
          ) : (
            <span style={{color: 'var(--success)'}}>All students marked</span>
          )}
        </div>
        <button 
          className="save-btn" 
          onClick={saveAttendance}
          disabled={saving}
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              Save Attendance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;