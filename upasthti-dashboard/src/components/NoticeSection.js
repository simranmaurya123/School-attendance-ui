import React from 'react';

const NoticeSection = () => {
  const notices = [
    'Mid-term exams will start from 20th September.',
    'Project submission deadline is 18th September.',
    'Annual sports meet registration open till 25th September.',
    'Library will be closed on 15th September for maintenance.'
  ];

  return (
    <div className="notice-section">
      <h3>Notice</h3>
      <ul className="notice-list">
        {notices.map((notice, index) => (
          <li key={index}>{notice}</li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeSection;