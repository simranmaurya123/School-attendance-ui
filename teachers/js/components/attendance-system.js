/**
 * Attendance Management System
 * Handles class selection, student attendance marking, and data persistence
 */

class AttendanceSystem {
    constructor() {
        this.currentClass = null;
        this.students = [];
        this.attendanceData = {};
        this.init();
    }

    init() {
        console.log('Attendance System initialized');
        this.loadFromStorage();
        this.bindEvents();
    }

    // Load data from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('attendanceSystem');
            if (saved) {
                const data = JSON.parse(saved);
                this.attendanceData = data.attendanceData || {};
            }
        } catch (error) {
            console.error('Error loading attendance data:', error);
        }
    }

    // Save data to localStorage
    saveToStorage() {
        try {
            const data = {
                attendanceData: this.attendanceData,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('attendanceSystem', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving attendance data:', error);
        }
    }

    // Set current class
    setClass(classData) {
        this.currentClass = classData;
        this.students = this.getStudentsForClass(classData.id);
        this.initializeAttendanceData();
    }

    // Get students for a specific class
    getStudentsForClass(classId) {
        const studentDatabase = {
            'class_10a_math': [
                { id: 1, name: 'Alice Johnson', rollNumber: '10A001', email: 'alice@school.edu' },
                { id: 2, name: 'Bob Smith', rollNumber: '10A002', email: 'bob@school.edu' },
                { id: 3, name: 'Carol Wilson', rollNumber: '10A003', email: 'carol@school.edu' },
                { id: 4, name: 'David Brown', rollNumber: '10A004', email: 'david@school.edu' },
                { id: 5, name: 'Eva Davis', rollNumber: '10A005', email: 'eva@school.edu' },
                { id: 6, name: 'Frank Miller', rollNumber: '10A006', email: 'frank@school.edu' },
                { id: 7, name: 'Grace Lee', rollNumber: '10A007', email: 'grace@school.edu' },
                { id: 8, name: 'Henry Clark', rollNumber: '10A008', email: 'henry@school.edu' },
                { id: 9, name: 'Ivy Rodriguez', rollNumber: '10A009', email: 'ivy@school.edu' },
                { id: 10, name: 'Jack Thompson', rollNumber: '10A010', email: 'jack@school.edu' }
            ],
            'class_10b_math': [
                { id: 11, name: 'Kate Anderson', rollNumber: '10B001', email: 'kate@school.edu' },
                { id: 12, name: 'Liam Wilson', rollNumber: '10B002', email: 'liam@school.edu' },
                { id: 13, name: 'Mia Garcia', rollNumber: '10B003', email: 'mia@school.edu' },
                { id: 14, name: 'Noah Martinez', rollNumber: '10B004', email: 'noah@school.edu' },
                { id: 15, name: 'Olivia Taylor', rollNumber: '10B005', email: 'olivia@school.edu' },
                { id: 16, name: 'Peter Johnson', rollNumber: '10B006', email: 'peter@school.edu' },
                { id: 17, name: 'Quinn Davis', rollNumber: '10B007', email: 'quinn@school.edu' },
                { id: 18, name: 'Rachel Brown', rollNumber: '10B008', email: 'rachel@school.edu' }
            ],
            'class_9a_math': [
                { id: 21, name: 'Sam Wilson', rollNumber: '9A001', email: 'sam@school.edu' },
                { id: 22, name: 'Tina Rodriguez', rollNumber: '9A002', email: 'tina@school.edu' },
                { id: 23, name: 'Uma Patel', rollNumber: '9A003', email: 'uma@school.edu' },
                { id: 24, name: 'Victor Chang', rollNumber: '9A004', email: 'victor@school.edu' },
                { id: 25, name: 'Wendy Kim', rollNumber: '9A005', email: 'wendy@school.edu' }
            ],
            'class_11a_math': [
                { id: 31, name: 'Alex Thompson', rollNumber: '11A001', email: 'alex@school.edu' },
                { id: 32, name: 'Bella Martinez', rollNumber: '11A002', email: 'bella@school.edu' },
                { id: 33, name: 'Chris Anderson', rollNumber: '11A003', email: 'chris@school.edu' },
                { id: 34, name: 'Diana Lee', rollNumber: '11A004', email: 'diana@school.edu' },
                { id: 35, name: 'Ethan Miller', rollNumber: '11A005', email: 'ethan@school.edu' }
            ],
            'class_12a_math': [
                { id: 41, name: 'Fiona Garcia', rollNumber: '12A001', email: 'fiona@school.edu' },
                { id: 42, name: 'George Wilson', rollNumber: '12A002', email: 'george@school.edu' },
                { id: 43, name: 'Hannah Davis', rollNumber: '12A003', email: 'hannah@school.edu' },
                { id: 44, name: 'Ian Rodriguez', rollNumber: '12A004', email: 'ian@school.edu' },
                { id: 45, name: 'Julia Clark', rollNumber: '12A005', email: 'julia@school.edu' }
            ],
            'class_8a_math': [
                { id: 51, name: 'Kevin Brown', rollNumber: '8A001', email: 'kevin@school.edu' },
                { id: 52, name: 'Luna Taylor', rollNumber: '8A002', email: 'luna@school.edu' },
                { id: 53, name: 'Mason Lee', rollNumber: '8A003', email: 'mason@school.edu' },
                { id: 54, name: 'Nora Johnson', rollNumber: '8A004', email: 'nora@school.edu' },
                { id: 55, name: 'Oliver Wilson', rollNumber: '8A005', email: 'oliver@school.edu' }
            ]
        };
        
        return studentDatabase[classId] || [];
    }

    // Initialize attendance data for current session
    initializeAttendanceData() {
        const sessionKey = this.getSessionKey();
        if (!this.attendanceData[sessionKey]) {
            this.attendanceData[sessionKey] = {};
            this.students.forEach(student => {
                this.attendanceData[sessionKey][student.id] = 'pending';
            });
        }
    }

    // Get session key for today's attendance
    getSessionKey() {
        const today = new Date().toISOString().split('T')[0];
        return `${this.currentClass.id}_${today}`;
    }

    // Mark attendance for a student
    markAttendance(studentId, status) {
        const sessionKey = this.getSessionKey();
        this.attendanceData[sessionKey][studentId] = status;
        this.saveToStorage();
        this.updateUI();
    }

    // Mark all students with a specific status
    markAll(status) {
        const sessionKey = this.getSessionKey();
        this.students.forEach(student => {
            this.attendanceData[sessionKey][student.id] = status;
        });
        this.saveToStorage();
        this.updateUI();
    }

    // Clear all attendance marks
    clearAll() {
        const sessionKey = this.getSessionKey();
        this.students.forEach(student => {
            this.attendanceData[sessionKey][student.id] = 'pending';
        });
        this.saveToStorage();
        this.updateUI();
    }

    // Get attendance status for a student
    getAttendanceStatus(studentId) {
        const sessionKey = this.getSessionKey();
        return this.attendanceData[sessionKey]?.[studentId] || 'pending';
    }

    // Get attendance statistics
    getStats() {
        const sessionKey = this.getSessionKey();
        const sessionData = this.attendanceData[sessionKey] || {};
        
        const present = Object.values(sessionData).filter(status => status === 'present').length;
        const absent = Object.values(sessionData).filter(status => status === 'absent').length;
        const pending = Object.values(sessionData).filter(status => status === 'pending').length;
        const total = this.students.length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        return { present, absent, pending, total, rate };
    }

    // Update UI elements
    updateUI() {
        this.updateStats();
        this.updateStudentList();
        this.updateSaveStatus();
    }

    // Update statistics display
    updateStats() {
        const stats = this.getStats();
        
        const elements = {
            'presentCount': stats.present,
            'absentCount': stats.absent,
            'pendingCount': stats.pending,
            'attendanceRate': stats.rate + '%'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    // Update student list display
    updateStudentList(filter = '') {
        const container = document.getElementById('studentsList');
        if (!container) return;

        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(filter.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(filter.toLowerCase())
        );

        container.innerHTML = filteredStudents.map(student => {
            const status = this.getAttendanceStatus(student.id);
            return this.renderStudentItem(student, status);
        }).join('');
    }

    // Render individual student item
    renderStudentItem(student, status) {
        return `
            <div class="student-item fade-in" data-student-id="${student.id}">
                <div class="student-avatar">
                    ${student.name.charAt(0).toUpperCase()}
                </div>
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-details">
                        <span><i class="fas fa-id-card"></i> ${student.rollNumber}</span>
                        <span><i class="fas fa-envelope"></i> ${student.email}</span>
                    </div>
                </div>
                <div class="attendance-actions">
                    <button class="attendance-btn present ${status === 'present' ? 'active' : ''}" 
                            onclick="attendanceSystem.markAttendance(${student.id}, 'present')">
                        <i class="fas fa-check"></i> Present
                    </button>
                    <button class="attendance-btn absent ${status === 'absent' ? 'active' : ''}" 
                            onclick="attendanceSystem.markAttendance(${student.id}, 'absent')">
                        <i class="fas fa-times"></i> Absent
                    </button>
                </div>
            </div>
        `;
    }

    // Update save status
    updateSaveStatus() {
        const stats = this.getStats();
        const statusEl = document.getElementById('saveStatus');
        
        if (!statusEl) return;

        if (stats.pending > 0) {
            statusEl.textContent = `${stats.pending} student(s) pending`;
            statusEl.style.color = '#f44336';
        } else {
            statusEl.textContent = 'All students marked';
            statusEl.style.color = '#4CAF50';
        }
    }

    // Save attendance record
    async saveAttendance() {
        const saveBtn = document.getElementById('saveBtn');
        const saveText = document.getElementById('saveText');
        const saveLoading = document.getElementById('saveLoading');
        
        if (!saveBtn || !saveText || !saveLoading) return;

        const stats = this.getStats();
        
        // Check if all students are marked
        if (stats.pending > 0) {
            if (!confirm(`${stats.pending} student(s) are still pending. Do you want to save anyway?`)) {
                return;
            }
        }

        // Show loading state
        saveBtn.disabled = true;
        saveText.textContent = 'Saving...';
        saveLoading.classList.add('active');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create attendance record
            const record = this.createAttendanceRecord(stats);

            // Save to localStorage (in real app, send to server)
            this.saveAttendanceRecord(record);

            // Show success
            saveText.textContent = 'Saved Successfully!';
            saveLoading.classList.remove('active');

            // Show notification
            this.showNotification('Attendance saved successfully!', 'success');

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'teacher-dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Error saving attendance:', error);
            saveText.textContent = 'Error Saving';
            saveLoading.classList.remove('active');
            saveBtn.disabled = false;
            this.showNotification('Error saving attendance. Please try again.', 'error');
        }
    }

    // Create attendance record object
    createAttendanceRecord(stats) {
        const sessionKey = this.getSessionKey();
        return {
            id: `attendance_${Date.now()}`,
            classId: this.currentClass.id,
            className: this.currentClass.name,
            subject: this.currentClass.subject,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toISOString(),
            attendance: this.attendanceData[sessionKey],
            summary: stats,
            students: this.students.map(student => ({
                ...student,
                status: this.getAttendanceStatus(student.id)
            }))
        };
    }

    // Save attendance record to localStorage
    saveAttendanceRecord(record) {
        try {
            const existingRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
            existingRecords.push(record);
            localStorage.setItem('attendanceRecords', JSON.stringify(existingRecords));
        } catch (error) {
            console.error('Error saving attendance record:', error);
            throw error;
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || '#2196f3';
    }

    // Bind event listeners
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchStudents');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.updateStudentList(e.target.value);
            });
        }
    }

    // Get attendance history for a student
    getStudentHistory(studentId) {
        const history = [];
        Object.keys(this.attendanceData).forEach(sessionKey => {
            if (this.attendanceData[sessionKey][studentId]) {
                const [classId, date] = sessionKey.split('_');
                history.push({
                    date,
                    classId,
                    status: this.attendanceData[sessionKey][studentId]
                });
            }
        });
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get class attendance summary
    getClassSummary(classId, startDate, endDate) {
        const summary = {
            totalSessions: 0,
            averageAttendance: 0,
            studentStats: {}
        };

        Object.keys(this.attendanceData).forEach(sessionKey => {
            const [sessionClassId, date] = sessionKey.split('_');
            if (sessionClassId === classId && 
                (!startDate || date >= startDate) && 
                (!endDate || date <= endDate)) {
                
                summary.totalSessions++;
                const sessionData = this.attendanceData[sessionKey];
                
                Object.keys(sessionData).forEach(studentId => {
                    if (!summary.studentStats[studentId]) {
                        summary.studentStats[studentId] = { present: 0, absent: 0, total: 0 };
                    }
                    
                    summary.studentStats[studentId].total++;
                    if (sessionData[studentId] === 'present') {
                        summary.studentStats[studentId].present++;
                    } else if (sessionData[studentId] === 'absent') {
                        summary.studentStats[studentId].absent++;
                    }
                });
            }
        });

        // Calculate average attendance
        const studentIds = Object.keys(summary.studentStats);
        if (studentIds.length > 0) {
            const totalPresent = studentIds.reduce((sum, id) => sum + summary.studentStats[id].present, 0);
            const totalPossible = studentIds.reduce((sum, id) => sum + summary.studentStats[id].total, 0);
            summary.averageAttendance = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
        }

        return summary;
    }
}

// Global instance
let attendanceSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    attendanceSystem = new AttendanceSystem();
});

// Global functions for HTML onclick handlers
function markAllPresent() {
    if (attendanceSystem) {
        attendanceSystem.markAll('present');
    }
}

function markAllAbsent() {
    if (attendanceSystem) {
        attendanceSystem.markAll('absent');
    }
}

function clearAll() {
    if (attendanceSystem) {
        attendanceSystem.clearAll();
    }
}

function saveAttendance() {
    if (attendanceSystem) {
        attendanceSystem.saveAttendance();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttendanceSystem;
}