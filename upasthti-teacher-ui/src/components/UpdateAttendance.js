import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UpdateAttendance.css';

const UpdateAttendance = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [originalAttendanceData, setOriginalAttendanceData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const classes = [
    { id: 'class_10a_math', name: 'Class 10-A Mathematics' },
    { id: 'class_10b_math', name: 'Class 10-B Mathematics' },
    { id: 'class_9a_math', name: 'Class 9-A Mathematics' },
    { id: 'class_9b_math', name: 'Class 9-B Mathematics' }
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
    loadAttendanceRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFilter, classFilter, attendanceRecords]);

  const loadAttendanceRecords = () => {
    // Generate sample records and load from localStorage
    const sampleRecords = generateSampleRecords();
    try {
      const savedRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      const mergedRecords = [...sampleRecords];
      
      savedRecords.forEach(saved => {
        if (!mergedRecords.find(record => record.id === saved.id)) {
          mergedRecords.push(saved);
        }
      });
      
      setAttendanceRecords(mergedRecords.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      setAttendanceRecords(sampleRecords);
    }
  };

  const generateSampleRecords = () => {
    const sampleRecords = [];
    const dates = ['2025-09-20', '2025-09-19', '2025-09-18', '2025-09-17', '2025-09-16'];

    classes.forEach((classInfo) => {
      dates.forEach((date, dateIndex) => {
        const totalStudents = classInfo.id.includes('10a') ? 10 : 5;
        const presentCount = Math.max(1, totalStudents - (dateIndex % 3));
        const absentCount = totalStudents - presentCount;

        sampleRecords.push({
          id: `${classInfo.id}_${date.replace(/-/g, '')}`,
          classId: classInfo.id,
          className: classInfo.name,
          date: date,
          time: new Date(date + 'T07:18:00').toISOString(),
          summary: {
            total: totalStudents,
            present: presentCount,
            absent: absentCount,
            rate: Math.round((presentCount / totalStudents) * 100)
          },
          attendance: {}
        });
      });
    });

    return sampleRecords;
  };

  const applyFilters = () => {
    const filtered = attendanceRecords.filter(record => {
      const matchesSearch = record.className.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || record.date === dateFilter;
      const matchesClass = !classFilter || record.classId === classFilter;
      return matchesSearch && matchesDate && matchesClass;
    });
    setFilteredRecords(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startEditingRecord = (record) => {
    const students = allStudentsData[record.classId] || [];
    setStudentsData(students);
    setEditingRecord(record);

    // Initialize attendance data
    let attendance = {};
    if (record.attendance && Object.keys(record.attendance).length > 0) {
      attendance = { ...record.attendance };
    } else {
      // Generate from summary
      const { present, absent } = record.summary;
      let presentCount = 0;
      let absentCount = 0;

      students.forEach(student => {
        if (presentCount < present) {
          attendance[student.id] = 'present';
          presentCount++;
        } else if (absentCount < absent) {
          attendance[student.id] = 'absent';
          absentCount++;
        } else {
          attendance[student.id] = 'pending';
        }
      });
    }

    setAttendanceData(attendance);
    setOriginalAttendanceData({ ...attendance });
    setHasUnsavedChanges(false);
  };

  const markAttendance = (studentId, status) => {
    const newAttendanceData = { ...attendanceData, [studentId]: status };
    setAttendanceData(newAttendanceData);
    setHasUnsavedChanges(JSON.stringify(newAttendanceData) !== JSON.stringify(originalAttendanceData));
  };

  const markAllAttendance = (status) => {
    const newAttendanceData = {};
    studentsData.forEach(student => {
      newAttendanceData[student.id] = status;
    });
    setAttendanceData(newAttendanceData);
    setHasUnsavedChanges(JSON.stringify(newAttendanceData) !== JSON.stringify(originalAttendanceData));
  };

  const resetChanges = () => {
    if (hasUnsavedChanges && !window.confirm('Are you sure you want to reset all changes?')) {
      return;
    }
    setAttendanceData({ ...originalAttendanceData });
    setHasUnsavedChanges(false);
  };

  const saveUpdates = async () => {
    if (!hasUnsavedChanges) {
      alert('No changes to save!');
      return;
    }

    const stats = getAttendanceStats();
    if (stats.pending > 0) {
      if (!window.confirm(`${stats.pending} student(s) are still pending. Do you want to save anyway?`)) {
        return;
      }
    }

    setSaving(true);

    setTimeout(() => {
      const updatedRecord = {
        ...editingRecord,
        attendance: attendanceData,
        lastModified: new Date().toISOString(),
        summary: {
          total: studentsData.length,
          present: stats.present,
          leave: stats.leave,
          absent: stats.absent,
          rate: Math.round((stats.present / studentsData.length) * 100)
        }
      };

      // Update records
      const updatedRecords = attendanceRecords.map(record =>
        record.id === editingRecord.id ? updatedRecord : record
      );
      setAttendanceRecords(updatedRecords);

      // Update localStorage
      const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
      const recordIndex = existingRecords.findIndex(r => r.id === editingRecord.id);
      if (recordIndex !== -1) {
        existingRecords[recordIndex] = updatedRecord;
      } else {
        existingRecords.push(updatedRecord);
      }
      localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));

      setSaving(false);
      setHasUnsavedChanges(false);
      setOriginalAttendanceData({ ...attendanceData });
      alert('Attendance updated successfully!');
    }, 2000);
  };

  const getAttendanceStats = () => {
    const values = Object.values(attendanceData);
    return {
      present: values.filter(status => status === 'present').length,
      leave: values.filter(status => status === 'leave').length,
      absent: values.filter(status => status === 'absent').length,
      pending: values.filter(status => status === 'pending').length
    };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setClassFilter('');
  };

  if (editingRecord) {
    const stats = getAttendanceStats();
    const filteredStudents = studentsData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="update-attendance">
        <div className="breadcrumb-container">
          <div className="breadcrumb-box" onClick={() => setEditingRecord(null)}>
            <span>Home → Update Attendance → Edit Record</span>
          </div>
        </div>

        <div className="edit-header">
          <button className="back-button" onClick={() => setEditingRecord(null)}>
            <i className="fas fa-arrow-left"></i>
            Back to Records
          </button>
          <h1>{editingRecord.className}</h1>
          <div className="edit-meta">
            <span>{formatDate(editingRecord.date)}</span>
            <span>Total Students: {studentsData.length}</span>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="changes-indicator">
            You have unsaved changes. Don't forget to save your updates!
          </div>
        )}

        <div className="edit-controls">
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
            <button className="btn btn-warning" onClick={() => markAllAttendance('leave')}>
              Mark All Leave
            </button>
            <button className="btn btn-danger" onClick={() => markAllAttendance('absent')}>
              Mark All Absent
            </button>
            <button className="btn btn-secondary" onClick={resetChanges}>
              Reset Changes
            </button>
          </div>
        </div>

        <div className="edit-stats">
          <div className="stat-card present">
            <span className="stat-number">{stats.present}</span>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat-card leave">
            <span className="stat-number">{stats.leave}</span>
            <div className="stat-label">Leave</div>
          </div>
          <div className="stat-card absent">
            <span className="stat-number">{stats.absent}</span>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat-card pending">
            <span className="stat-number">{stats.pending}</span>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="students-list">
          {filteredStudents.map(student => (
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
                  className={`attendance-btn present ${attendanceData[student.id] === 'present' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'present')}
                  title="Mark Present"
                  type="button"
                >
                  P
                </button>
                
                {/* Leave Button - Orange Circle with L */}
                <button
                  className={`attendance-btn leave ${attendanceData[student.id] === 'leave' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'leave')}
                  title="Mark Leave"
                  type="button"
                >
                  L
                </button>
                
                {/* Absent Button - Red Circle with A */}
                <button
                  className={`attendance-btn absent ${attendanceData[student.id] === 'absent' ? 'active' : ''}`}
                  onClick={() => markAttendance(student.id, 'absent')}
                  title="Mark Absent"
                  type="button"
                >
                  A
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="save-section">
          <div className="save-status">
            {hasUnsavedChanges ? (
              stats.pending > 0 ? (
                <span style={{color: 'var(--danger)'}}>Changes made • {stats.pending} student(s) pending</span>
              ) : (
                <span style={{color: 'var(--success)'}}>Changes made • Ready to save</span>
              )
            ) : (
              <span style={{color: 'var(--text-light)'}}>No changes made</span>
            )}
          </div>
          <button
            className="save-btn"
            onClick={saveUpdates}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Update Attendance
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="update-attendance">
      <div className="breadcrumb-container">
        <div className="breadcrumb-box" onClick={() => navigate('/')}>
          <span>Home → Update Attendance</span>
        </div>
      </div>

      <div className="update-header">
        <h1>Update Attendance</h1>
        <p>Modify previously saved attendance records</p>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <input
            type="text"
            className="search-box"
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <select
            className="class-filter"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        {(searchTerm || dateFilter || classFilter) && (
          <div className="filters-active">
            Filters applied. <button onClick={clearFilters}>Clear all</button>
          </div>
        )}
      </div>

      <div className="records-list">
        <div className="records-header">
          {filteredRecords.length} attendance record{filteredRecords.length !== 1 ? 's' : ''} found
        </div>
        
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No attendance records found</div>
            <div className="empty-message">
              {attendanceRecords.length === 0
                ? 'No attendance has been marked yet. Start by marking attendance for your classes.'
                : 'No records match your current filters. Try adjusting your search criteria.'
              }
            </div>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div key={record.id} className="record-item" onClick={() => startEditingRecord(record)}>
              <div className="record-info">
                <div className="record-title">{record.className}</div>
                <div className="record-details">
                  <span>{formatDate(record.date)}</span>
                  <span>{formatTime(record.time)}</span>
                </div>
              </div>
              <div className="record-stats">
                <span className="stat-badge stat-present">{record.summary.present} Present</span>
                <span className="stat-badge stat-absent">{record.summary.absent} Absent</span>
                <span className="stat-badge stat-total">{record.summary.total} Total</span>
                <button className="update-btn" onClick={(e) => {
                  e.stopPropagation();
                  startEditingRecord(record);
                }}>
                  Update
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpdateAttendance;