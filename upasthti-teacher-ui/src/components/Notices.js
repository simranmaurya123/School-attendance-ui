import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Notices.css';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    priority: '',
    class: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadNotices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notices, filters]);

  const loadNotices = () => {
    const savedNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    
    if (savedNotices.length === 0) {
      const sampleNotices = generateSampleNotices();
      localStorage.setItem('notices', JSON.stringify(sampleNotices));
      setNotices(sampleNotices);
    } else {
      setNotices(savedNotices);
    }
  };

  const generateSampleNotices = () => {
    const sampleNotices = [
      {
        id: 'notice_001',
        title: 'Mathematics Test Schedule',
        content: 'Dear students, the Mathematics test is scheduled for next Friday at 10:00 AM. Please prepare chapters 1-5 and bring your calculators.',
        priority: 'high',
        recipients: 'class_10a_math',
        recipientName: 'Class 10-A Mathematics',
        date: '2025-09-20',
        time: '09:30 AM',
        author: 'Teacher Name'
      },
      {
        id: 'notice_002',
        title: 'Holiday Notice',
        content: 'School will remain closed on Monday due to a public holiday. Regular classes will resume on Tuesday.',
        priority: 'medium',
        recipients: 'all',
        recipientName: 'All Classes',
        date: '2025-09-19',
        time: '02:15 PM',
        author: 'Teacher Name'
      },
      {
        id: 'notice_003',
        title: 'Assignment Submission',
        content: 'Reminder: Please submit your Mathematics assignments by tomorrow evening. Late submissions will not be accepted.',
        priority: 'high',
        recipients: 'class_10b_math',
        recipientName: 'Class 10-B Mathematics',
        date: '2025-09-18',
        time: '11:45 AM',
        author: 'Teacher Name'
      },
      {
        id: 'notice_004',
        title: 'Parent-Teacher Meeting',
        content: 'Parent-Teacher meeting is scheduled for this Saturday from 10:00 AM to 4:00 PM. Please inform your parents.',
        priority: 'medium',
        recipients: 'all',
        recipientName: 'All Classes',
        date: '2025-09-17',
        time: '03:00 PM',
        author: 'Teacher Name'
      },
      {
        id: 'notice_005',
        title: 'Library Book Return',
        content: 'All borrowed library books must be returned by the end of this week. Please check your library cards.',
        priority: 'low',
        recipients: 'class_9a_math',
        recipientName: 'Class 9-A Mathematics',
        date: '2025-09-16',
        time: '01:20 PM',
        author: 'Teacher Name'
      }
    ];

    return sampleNotices.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  };

  const applyFilters = () => {
    let filtered = notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          notice.content.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDate = !filters.date || notice.date === filters.date;
      const matchesPriority = !filters.priority || notice.priority === filters.priority;
      const matchesClass = !filters.class || notice.recipients === filters.class;
      
      return matchesSearch && matchesDate && matchesPriority && matchesClass;
    });
    
    setFilteredNotices(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      date: '',
      priority: '',
      class: ''
    });
  };

  const editNotice = (noticeId) => {
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
      sessionStorage.setItem('editNotice', JSON.stringify(notice));
      navigate('/compose-notice?edit=true');
    }
  };

  const deleteNotice = (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      const updatedNotices = notices.filter(n => n.id !== noticeId);
      setNotices(updatedNotices);
      localStorage.setItem('notices', JSON.stringify(updatedNotices));
    }
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

  const hasActiveFilters = filters.search || filters.date || filters.priority || filters.class;

  return (
    <div className="page-container">
      <div className="breadcrumb-container">
        <div className="breadcrumb-box" onClick={() => navigate('/')}>
          <span>Home → Notice Board</span>
        </div>
      </div>

        <div className="header">
          <div className="header-content">
            <h1>Notice Board</h1>
            <p>Manage and send notices to students and classes</p>
          </div>
          <button className="compose-btn" onClick={() => navigate('/compose-notice')}>
            Compose Notice
          </button>
        </div>

        <div className="filters-section">
          <div className="filters-controls">
            <input 
              type="text" 
              className="search-box" 
              placeholder="Search notices..." 
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <input 
              type="date" 
              className="date-filter"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
            <select 
              className="priority-filter"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select 
              className="class-filter"
              value={filters.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            >
              <option value="">All Recipients</option>
              <option value="all">All Classes</option>
              <option value="class_10a_math">Class 10-A Mathematics</option>
              <option value="class_10b_math">Class 10-B Mathematics</option>
              <option value="class_9a_math">Class 9-A Mathematics</option>
            </select>
          </div>
          {hasActiveFilters && (
            <div className="filters-active">
              Filters applied. <button onClick={clearFilters} className="clear-filters-btn">Clear all</button>
            </div>
          )}
        </div>

        <div className="notices-list">
          <div className="notices-header">
            <span>{filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''} found</span>
          </div>
          
          {filteredNotices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">No notices found</div>
              <div className="empty-message">
                {notices.length === 0 
                  ? 'No notices have been created yet. Start by composing your first notice.'
                  : 'No notices match your current filters. Try adjusting your search criteria.'
                }
              </div>
            </div>
          ) : (
            filteredNotices.map(notice => (
              <div key={notice.id} className="notice-item">
                <div className="notice-header">
                  <div>
                    <div className="notice-title">{notice.title}</div>
                    <div className="notice-meta">
                      <span>{formatDate(notice.date)}</span>
                      <span>{notice.time}</span>
                      <span>{notice.author}</span>
                    </div>
                  </div>
                  <div className="notice-actions">
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => editNotice(notice.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => deleteNotice(notice.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="notice-content">{notice.content}</div>
                <div className="notice-badges">
                  <span className={`badge priority-${notice.priority}`}>
                    {notice.priority.toUpperCase()} Priority
                  </span>
                  <span className={`badge ${notice.recipients === 'all' ? 'all-classes-badge' : 'class-badge'}`}>
                    {notice.recipientName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
}

export default Notices;