// Attendance Management System
class AttendanceManager {
    constructor() {
        this.students = [];
        this.attendanceRecords = [];
        this.currentClass = null;
        this.init();
    }
    
    init() {
        console.log('Attendance Manager initialized');
        this.loadAttendanceData();
        this.bindEvents();
    }
    
    // Load attendance data from localStorage or API
    loadAttendanceData() {
        try {
            const savedData = localStorage.getItem('teacherAttendanceData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.students = data.students || [];
                this.attendanceRecords = data.records || [];
            } else {
                // Initialize with sample data
                this.initializeSampleData();
            }
        } catch (error) {
            console.error('Error loading attendance data:', error);
            this.initializeSampleData();
        }
    }
    
    // Initialize with sample student data
    initializeSampleData() {
        this.students = [
            { id: 1, name: 'John Doe', rollNumber: '001', class: '10A' },
            { id: 2, name: 'Jane Smith', rollNumber: '002', class: '10A' },
            { id: 3, name: 'Mike Johnson', rollNumber: '003', class: '10A' },
            { id: 4, name: 'Sarah Wilson', rollNumber: '004', class: '10A' },
            { id: 5, name: 'David Brown', rollNumber: '005', class: '10A' }
        ];
        
        this.attendanceRecords = [
            {
                id: 1,
                date: new Date().toISOString().split('T')[0],
                class: '10A',
                subject: 'Mathematics',
                students: [
                    { studentId: 1, status: 'present' },
                    { studentId: 2, status: 'present' },
                    { studentId: 3, status: 'absent' },
                    { studentId: 4, status: 'present' },
                    { studentId: 5, status: 'late' }
                ]
            }
        ];
        
        this.saveAttendanceData();
    }
    
    // Save attendance data to localStorage
    saveAttendanceData() {
        try {
            const data = {
                students: this.students,
                records: this.attendanceRecords
            };
            localStorage.setItem('teacherAttendanceData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving attendance data:', error);
        }
    }
    
    // Bind event listeners
    bindEvents() {
        // Add event listeners for attendance-related actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mark-attendance-btn')) {
                this.openAttendanceModal();
            }
            
            if (e.target.classList.contains('view-reports-btn')) {
                this.showAttendanceReports();
            }
        });
    }
    
    // Open attendance marking modal
    openAttendanceModal() {
        const modal = this.createAttendanceModal();
        document.body.appendChild(modal);
        
        // Animate modal appearance
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
    
    // Create attendance modal
    createAttendanceModal() {
        const modal = document.createElement('div');
        modal.className = 'attendance-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                ">
                    <h2 style="margin: 0; color: #333;">Mark Attendance</h2>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                
                <div class="class-selection" style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Select Class:</label>
                    <select class="class-select" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 1rem;
                    ">
                        <option value="10A">Class 10A</option>
                        <option value="10B">Class 10B</option>
                        <option value="11A">Class 11A</option>
                    </select>
                </div>
                
                <div class="student-list">
                    ${this.renderStudentList()}
                </div>
                
                <div class="modal-actions" style="
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                ">
                    <button class="cancel-btn" style="
                        padding: 0.75rem 1.5rem;
                        border: 1px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Cancel</button>
                    <button class="save-attendance-btn" style="
                        padding: 0.75rem 1.5rem;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    ">Save Attendance</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.save-attendance-btn').addEventListener('click', () => this.saveAttendance(modal));
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        return modal;
    }
    
    // Render student list for attendance
    renderStudentList() {
        return this.students.map(student => `
            <div class="student-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 0.5rem;
            ">
                <div class="student-info">
                    <div style="font-weight: 600;">${student.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">Roll No: ${student.rollNumber}</div>
                </div>
                <div class="attendance-options" style="display: flex; gap: 0.5rem;">
                    <label style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="radio" name="attendance_${student.id}" value="present" checked>
                        <span style="color: #4CAF50;">Present</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="radio" name="attendance_${student.id}" value="absent">
                        <span style="color: #F44336;">Absent</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="radio" name="attendance_${student.id}" value="late">
                        <span style="color: #FF9800;">Late</span>
                    </label>
                </div>
            </div>
        `).join('');
    }
    
    // Close modal
    closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 300);
    }
    
    // Save attendance data
    saveAttendance(modal) {
        const classSelect = modal.querySelector('.class-select');
        const selectedClass = classSelect.value;
        
        const attendanceData = [];
        this.students.forEach(student => {
            const statusElement = modal.querySelector(`input[name="attendance_${student.id}"]:checked`);
            if (statusElement) {
                attendanceData.push({
                    studentId: student.id,
                    status: statusElement.value
                });
            }
        });
        
        // Create attendance record
        const record = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            class: selectedClass,
            subject: 'General', // This could be selected from a dropdown
            students: attendanceData
        };
        
        this.attendanceRecords.push(record);
        this.saveAttendanceData();
        
        // Show success notification
        window.TeacherDashboard.showNotification('Attendance marked successfully!', 'success');
        
        // Update dashboard stats
        this.updateAttendanceStats();
        
        this.closeModal(modal);
    }
    
    // Update attendance statistics on dashboard
    updateAttendanceStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = this.attendanceRecords.filter(record => record.date === today);
        
        if (todayRecords.length > 0) {
            const latestRecord = todayRecords[todayRecords.length - 1];
            const presentStudents = latestRecord.students.filter(s => s.status === 'present').length;
            const totalStudents = latestRecord.students.length;
            const presentPercentage = Math.round((presentStudents / totalStudents) * 100);
            
            // Update the stats card
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards[1]) {
                const numberElement = statCards[1].querySelector('.stat-number');
                const changeElement = statCards[1].querySelector('.stat-change');
                
                if (numberElement) numberElement.textContent = presentStudents;
                if (changeElement) changeElement.textContent = `${presentPercentage}%`;
            }
        }
    }
    
    // Show attendance reports
    showAttendanceReports() {
        window.TeacherDashboard.showNotification('Attendance reports feature coming soon!', 'info');
    }
    
    // Get attendance statistics
    getAttendanceStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = this.attendanceRecords.filter(record => record.date === today);
        
        if (todayRecords.length === 0) {
            return {
                totalStudents: this.students.length,
                presentStudents: 0,
                absentStudents: 0,
                lateStudents: 0,
                attendancePercentage: 0
            };
        }
        
        const latestRecord = todayRecords[todayRecords.length - 1];
        const present = latestRecord.students.filter(s => s.status === 'present').length;
        const absent = latestRecord.students.filter(s => s.status === 'absent').length;
        const late = latestRecord.students.filter(s => s.status === 'late').length;
        const total = latestRecord.students.length;
        
        return {
            totalStudents: total,
            presentStudents: present,
            absentStudents: absent,
            lateStudents: late,
            attendancePercentage: Math.round((present / total) * 100)
        };
    }
}

// Initialize attendance manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.attendanceManager = new AttendanceManager();
});

// Export for use in other files
window.AttendanceManager = AttendanceManager;
