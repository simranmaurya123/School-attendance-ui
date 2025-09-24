// Timetable Functionality
function initializeTimetable() {
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    const currentDateSpan = document.querySelector('#current-date span');
    const dayLabel = document.querySelector('.day-label');
    
    let currentDate = new Date(2025, 8, 23); // September 23, 2025 (month is 0-indexed)
    
    // Sample timetable data for different days
    const timetableData = {
        'Monday': [
            {
                time: { start: '09:00', end: '09:55' },
                subject: 'Mathematics',
                instructor: '10 A',
                room: 'Room 205'
            },
            {
                time: { start: '10:00', end: '10:55' },
                subject: 'English',
                instructor: '8 B',
                room: 'Room 206'
            },
            {
                time: { start: '11:00', end: '11:55' },
                subject: 'Science',
                instructor: '9 C',
                room: 'Room 207'
            }
        ],
        'Tuesday': [
            {
                time: { start: '09:15', end: '10:10' },
                subject: 'Mathematics',
                instructor: '10 A',
                room: 'Room 310'
            },
            {
                time: { start: '10:15', end: '11:10' },
                subject: 'Physics',
                instructor: '8 B',
                room: 'Room 311'
            },
            {
                time: { start: '11:15', end: '12:10' },
                subject: 'Chemistry',
                instructor: '9 C',
                room: 'Room 312'
            },
            {
                time: { start: '12:15', end: '13:10' },
                subject: 'Biology',
                instructor: '9 B',
                room: 'Room 313'
            }
        ],
        'Wednesday': [
            {
                time: { start: '09:30', end: '10:25' },
                subject: 'History',
                instructor: '10 A',
                room: 'Room 408'
            },
            {
                time: { start: '10:30', end: '11:25' },
                subject: 'Geography',
                instructor: '8 B',
                room: 'Room 409'
            }
        ],
        'Thursday': [
            {
                time: { start: '08:45', end: '09:40' },
                subject: 'Hindi',
                instructor: '9 C',
                room: 'Room 512'
            },
            {
                time: { start: '09:45', end: '10:40' },
                subject: 'Computer Science',
                instructor: '9 B',
                room: 'Room 513'
            },
            {
                time: { start: '10:45', end: '11:40' },
                subject: 'Physical Education',
                instructor: '10 A',
                room: 'Sports Ground'
            }
        ],
        'Friday': [
            {
                time: { start: '09:00', end: '09:55' },
                subject: 'Art & Craft',
                instructor: '8 B',
                room: 'Art Room'
            },
            {
                time: { start: '10:00', end: '10:55' },
                subject: 'Music',
                instructor: '9 C',
                room: 'Music Room'
            }
        ],
        'Saturday': [],
        'Sunday': []
    };
    
    function updateTimetable() {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = dayNames[currentDate.getDay()];
        const monthName = monthNames[currentDate.getMonth()];
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();
        
        // Update date display
        currentDateSpan.textContent = `${monthName} ${day}, ${year}`;
        dayLabel.textContent = dayName;
        
        // Get classes for current day
        const classes = timetableData[dayName] || [];
        
        // Update classes list
        const classesList = document.querySelector('.classes-list');
        if (classes.length === 0) {
            classesList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;"><i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>No classes scheduled for this day</div>';
        } else {
            classesList.innerHTML = classes.map(classItem => `
                <div class="class-item">
                    <div class="time-slot">
                        <span class="start-time">${classItem.time.start}</span>
                        <span class="dash">-</span>
                        <span class="end-time">${classItem.time.end}</span>
                    </div>
                    <div class="class-details">
                        <div class="status-indicator active"></div>
                        <div class="class-info">
                            <h4 class="subject-name">${classItem.subject}</h4>
                            <p class="instructor-info">${classItem.instructor}</p>
                            <p class="room-info">${classItem.room}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Event listeners for navigation
    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateTimetable();
    });
    
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateTimetable();
    });
    
    // Initialize with current date
    updateTimetable();
}

// Initialize timetable when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTimetable();
});