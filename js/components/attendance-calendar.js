class AttendanceCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = this.getEventsData();
        this.init();
    }

    getEventsData() {
        // Sample events data - in a real app, this would come from a backend
        return {
            '2025-10-02': [
                { title: 'Gandhi Jayanti', time: '09:00', type: 'orange' }
            ]
        };
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.querySelector('.next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.querySelector('.today-btn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

        // Generate calendar days
        this.generateCalendarDays(year, month);
    }

    generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const today = new Date();

        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';

        // Previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNumber = prevMonthDays - i;
            const dayElement = this.createDayElement(dayNumber, true, year, month - 1);
            calendarDays.appendChild(dayElement);
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = (
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate()
            );
            const dayElement = this.createDayElement(day, false, year, month, isToday);
            calendarDays.appendChild(dayElement);
        }

        // Next month's leading days
        const remainingDays = 42 - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = this.createDayElement(day, true, year, month + 1);
            calendarDays.appendChild(dayElement);
        }
    }

    createDayElement(dayNumber, isOtherMonth, year, month, isToday = false) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

        const dayNumberDiv = document.createElement('div');
        dayNumberDiv.className = 'day-number';
        dayNumberDiv.textContent = dayNumber;
        dayDiv.appendChild(dayNumberDiv);

        if (!isOtherMonth) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const dayEvents = this.events[dateString] || [];
            
            const visibleEvents = dayEvents.slice(0, 3);
            visibleEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `event ${event.type}`;
                eventDiv.textContent = `${event.time} ${event.title}`;
                dayDiv.appendChild(eventDiv);
            });

            if (dayEvents.length > 3) {
                const moreDiv = document.createElement('div');
                moreDiv.className = 'more-events';
                moreDiv.textContent = `+${dayEvents.length - 3} more`;
                dayDiv.appendChild(moreDiv);
            }
        }

        return dayDiv;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AttendanceCalendar();
});
