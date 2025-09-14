class Calendar {
    constructor(container) {
        this.container = container;
        this.date = new Date();
        this.selectedDate = new Date();
        this.events = this.getInitialEvents();
        this.attendance = this.getAttendanceData();
        this.render();
        this.attachEventListeners();
    }

    getInitialEvents() {
        // Sample events data - in a real app, this would come from a backend
        return {
            '2025-09-15': [{ title: 'JavaScript Course', type: 'course' }],
            '2025-09-17': [{ title: 'Web Design Class', type: 'course' }],
            '2025-09-22': [{ title: 'Python Programming', type: 'course' }]
        };
    }

    getAttendanceData() {
        // Sample attendance data - in a real app, this would come from a backend
        return {
            '2025-09-01': 'present',
            '2025-09-02': 'present',
            '2025-09-03': 'absent',
            '2025-09-04': 'present',
            '2025-09-05': 'present',
            '2025-09-06': 'absent',
            '2025-09-07': 'present',
            '2025-09-08': 'present',
            '2025-09-09': 'present',
            '2025-09-10': 'absent',
            '2025-09-11': 'present',
            '2025-09-12': 'present',
            // Today's date (13th) will only have border
            '2025-09-14': 'present',
            '2025-09-15': 'absent',
            '2025-09-16': 'present',
            '2025-09-17': 'present',
            '2025-09-18': 'absent',
            '2025-09-19': 'present',
            '2025-09-20': 'present'
        };
    }

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        
        this.container.innerHTML = `
            <div class="calendar-header">
                <h3 class="calendar-title">${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}</h3>
                <div class="calendar-nav">
                    <button class="prev-month">←</button>
                    <button class="next-month">→</button>
                </div>
            </div>
            <div class="attendance-legend">
                <div class="legend-item">
                    <span class="legend-dot present"></span>
                    <span>Present</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot absent"></span>
                    <span>Absent</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot today"></span>
                    <span>Today</span>
                </div>
            </div>
            <div class="calendar-grid">
                ${this.generateWeekdaysHTML()}
                ${this.generateDaysHTML()}
            </div>
            ${this.generateEventPreviewHTML()}
        `;
    }

    generateWeekdaysHTML() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays.map(day => `
            <div class="calendar-weekday">${day}</div>
        `).join('');
    }

    generateDaysHTML() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        let days = [];

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            days.push(`
                <div class="calendar-day other-month">
                    ${prevMonthDays - i}
                </div>
            `);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = this.formatDate(date);
            const hasEvent = this.events[dateString]?.length > 0;
            const isToday = this.isToday(date);
            const isSelected = this.isSelected(date);
            const attendanceStatus = this.attendance[dateString];

            let attendanceClass = '';
            if (attendanceStatus === 'present') {
                attendanceClass = 'attendance-present';
            } else if (attendanceStatus === 'absent') {
                attendanceClass = 'attendance-absent';
            }

            days.push(`
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent ? 'has-event' : ''} ${attendanceClass}"
                     data-date="${dateString}">
                    <span class="day-number">${day}</span>
                </div>
            `);
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
        for (let day = 1; day <= remainingDays; day++) {
            days.push(`
                <div class="calendar-day other-month">
                    ${day}
                </div>
            `);
        }

        return days.join('');
    }

    generateEventPreviewHTML() {
        const dateString = this.formatDate(this.selectedDate);
        const events = this.events[dateString] || [];

        if (events.length === 0) return '';

        return `
            <div class="event-preview">
                ${events.map(event => `
                    <div class="event-item">
                        <span class="event-dot"></span>
                        <span class="event-title">${event.title}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        this.container.querySelector('.prev-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });

        this.container.querySelector('.next-month').addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });

        this.container.addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && !dayElement.classList.contains('other-month')) {
                const dateString = dayElement.dataset.date;
                this.selectedDate = new Date(dateString);
                this.render();
            }
        });
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date) {
        return date.toDateString() === this.selectedDate.toDateString();
    }
}

// Initialize calendar when document is loaded
function initializeCalendar() {
    const calendarContainer = document.querySelector('.calendar-widget');
    if (calendarContainer) {
        new Calendar(calendarContainer);
    }
}
