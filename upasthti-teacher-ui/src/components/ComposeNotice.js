import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import './Notices.css';

function ComposeNotice() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipients: '',
    priority: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(location.search);
    const editMode = urlParams.get('edit');
    
    if (editMode === 'true') {
      loadNoticeForEditing();
    }
  }, [location]);

  const loadNoticeForEditing = () => {
    const noticeToEdit = JSON.parse(sessionStorage.getItem('editNotice') || '{}');
    
    if (noticeToEdit.id) {
      setIsEditMode(true);
      setEditingNoticeId(noticeToEdit.id);
      setFormData({
        title: noticeToEdit.title,
        content: noticeToEdit.content,
        recipients: noticeToEdit.recipients,
        priority: noticeToEdit.priority
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (priority) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const saveDraft = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title to save as draft.');
      return;
    }
    
    const drafts = JSON.parse(localStorage.getItem('noticeDrafts') || '[]');
    const draftId = 'draft_' + Date.now();
    
    const draft = {
      id: draftId,
      ...formData,
      savedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    drafts.push(draft);
    localStorage.setItem('noticeDrafts', JSON.stringify(drafts));
    
    alert('Notice saved as draft successfully!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.recipients || !formData.priority) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (isEditMode) {
        updateExistingNotice();
      } else {
        createNewNotice();
      }
    }, 2000);
  };

  const createNewNotice = () => {
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    const noticeId = 'notice_' + Date.now();
    
    const newNotice = {
      id: noticeId,
      ...formData,
      recipientName: getRecipientName(formData.recipients),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      author: 'Teacher Name'
    };
    
    notices.unshift(newNotice);
    localStorage.setItem('notices', JSON.stringify(notices));
    
    alert('Notice sent successfully!');
    navigate('/notices');
  };

  const updateExistingNotice = () => {
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    const noticeIndex = notices.findIndex(n => n.id === editingNoticeId);
    
    if (noticeIndex !== -1) {
      notices[noticeIndex] = {
        ...notices[noticeIndex],
        ...formData,
        recipientName: getRecipientName(formData.recipients),
        lastModified: new Date().toISOString()
      };
      
      localStorage.setItem('notices', JSON.stringify(notices));
      alert('Notice updated successfully!');
      navigate('/notices');
    } else {
      alert('Error updating notice. Please try again.');
      setIsLoading(false);
    }
  };

  const getRecipientName = (recipientValue) => {
    const recipientMap = {
      'all': 'All Classes',
      'class_10a_math': 'Class 10-A Mathematics',
      'class_10b_math': 'Class 10-B Mathematics',
      'class_9a_math': 'Class 9-A Mathematics',
      'class_9b_math': 'Class 9-B Mathematics'
    };
    return recipientMap[recipientValue] || '';
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', { 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit' 
      })
    };
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div className="page-container">
      <div className="breadcrumb-container">
        <div className="breadcrumb-box" onClick={() => navigate('/notices')}>
          <span>Home → Notice Board → Compose</span>
        </div>
      </div>

        <div className="header">
          <h1>{isEditMode ? 'Edit Notice' : 'Compose New Notice'}</h1>
          <p>{isEditMode ? 'Update and modify existing notice' : 'Create and send notices to students and classes'}</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Notice Title *</label>
              <input 
                type="text" 
                name="title"
                className="form-input" 
                placeholder="Enter notice title..." 
                value={formData.title}
                onChange={handleInputChange}
                maxLength="100"
                required 
              />
              <div className="character-count">
                {formData.title.length}/100 characters
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notice Content *</label>
              <textarea 
                name="content"
                className="form-textarea" 
                placeholder="Write your notice content here..." 
                value={formData.content}
                onChange={handleInputChange}
                maxLength="1000"
                required
              ></textarea>
              <div className="character-count">
                {formData.content.length}/1000 characters
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Send To *</label>
                <select 
                  name="recipients"
                  className="form-select" 
                  value={formData.recipients}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select recipients...</option>
                  <option value="all">All Classes</option>
                  <option value="class_10a_math">Class 10-A Mathematics</option>
                  <option value="class_10b_math">Class 10-B Mathematics</option>
                  <option value="class_9a_math">Class 9-A Mathematics</option>
                  <option value="class_9b_math">Class 9-B Mathematics</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level *</label>
                <div className="priority-options">
                  {['high', 'medium', 'low'].map(priority => (
                    <label 
                      key={priority}
                      className={`priority-option priority-${priority} ${formData.priority === priority ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange(priority)}
                    >
                      <input 
                        type="radio" 
                        name="priority" 
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={() => {}}
                        required
                      />
                      <span>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {showPreview && (
              <div className="preview-section show">
                <div className="preview-header">Preview</div>
                <div className="preview-title">{formData.title || 'Notice Title'}</div>
                <div className="preview-content">{formData.content || 'Notice content will appear here...'}</div>
                <div className="preview-meta">
                  <span>{currentDateTime.date}</span>
                  <span>{currentDateTime.time}</span>
                  <span>Teacher Name</span>
                </div>
                <div className="preview-badges">
                  {formData.priority && (
                    <span className={`badge priority-${formData.priority}-badge`}>
                      {formData.priority.toUpperCase()} Priority
                    </span>
                  )}
                  {formData.recipients && (
                    <span className="badge recipient-badge">
                      {getRecipientName(formData.recipients)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={togglePreview}>
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={saveDraft}>
                Save Draft
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Sending...' : (isEditMode ? 'Update Notice' : 'Send Notice')}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}

export default ComposeNotice;