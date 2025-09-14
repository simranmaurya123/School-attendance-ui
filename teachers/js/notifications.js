// Timer functionality for the teacher dashboard
class TimerManager {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.timerInterval = null;
        this.circleProgress = null;
        this.timeDisplay = null;
        this.playButton = null;
        this.init();
    }
    
    init() {
        console.log('Timer Manager initialized');
        this.bindElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    // Bind DOM elements
    bindElements() {
        this.timeDisplay = document.querySelector('.time');
        this.circleProgress = document.querySelector('.timer-progress');
        this.playButton = document.querySelector('.play-btn');
        
        if (!this.timeDisplay || !this.circleProgress || !this.playButton) {
            console.warn('Timer elements not found in DOM');
            return;
        }
    }
    
    // Bind event listeners
    bindEvents() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.toggleTimer();
            });
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space bar to toggle timer
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.toggleTimer();
            }
            
            // R key to reset timer
            if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.resetTimer();
            }
        });
    }
    
    // Toggle timer start/stop
    toggleTimer() {
        if (this.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }
    
    // Start the timer
    startTimer() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        
        // Update button state
        this.updateButtonState();
        
        // Start the interval
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Show notification
        window.TeacherDashboard?.showNotification('Timer started', 'success');
        
        // Add timer session to history
        this.logTimerSession('start');
    }
    
    // Stop the timer
    stopTimer() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Update button state
        this.updateButtonState();
        
        // Show notification
        window.TeacherDashboard?.showNotification('Timer stopped', 'info');
        
        // Log timer session
        this.logTimerSession('stop');
    }
    
    // Reset the timer
    resetTimer() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.updateDisplay();
        this.updateProgress();
        
        // Show notification
        window.TeacherDashboard?.showNotification('Timer reset', 'info');
        
        // Log timer session
        this.logTimerSession('reset');
    }
    
    // Update timer elapsed time
    updateTimer() {
        if (!this.isRunning) return;
        
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        this.updateProgress();
    }
    
    // Update time display
    updateDisplay() {
        if (!this.timeDisplay) return;
        
        const seconds = Math.floor(this.elapsedTime / 1000);
        const formattedTime = this.formatTime(seconds);
        this.timeDisplay.textContent = formattedTime;
        
        // Update document title with timer
        if (this.isRunning) {
            document.title = `${formattedTime} - Teacher Dashboard`;
        } else {
            document.title = 'Teacher Dashboard - Upasthiti';
        }
    }
    
    // Update circular progress
    updateProgress() {
        if (!this.circleProgress) return;
        
        // Calculate progress based on a 60-minute cycle
        const seconds = Math.floor(this.elapsedTime / 1000);
        const maxSeconds = 60 * 60; // 1 hour
        const progress = (seconds % maxSeconds) / maxSeconds;
        
        // Update stroke-dashoffset for circular progress
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (progress * circumference);
        
        this.circleProgress.style.strokeDashoffset = offset;
        
        // Change color based on time elapsed
        if (seconds > 3600) { // More than 1 hour
            this.circleProgress.style.stroke = '#FF9800'; // Orange
        } else if (seconds > 1800) { // More than 30 minutes
            this.circleProgress.style.stroke = '#4CAF50'; // Green
        } else {
            this.circleProgress.style.stroke = '#2196F3'; // Blue
        }
    }
    
    // Update button state
    updateButtonState() {
        if (!this.playButton) return;
        
        const icon = this.playButton.querySelector('i');
        if (!icon) return;
        
        if (this.isRunning) {
            icon.className = 'fas fa-pause';
            this.playButton.className = 'timer-btn pause-btn';
            this.playButton.title = 'Pause Timer (Space)';
        } else {
            icon.className = 'fas fa-play';
            this.playButton.className = 'timer-btn play-btn';
            this.playButton.title = 'Start Timer (Space)';
        }
    }
    
    // Format time for display
    formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Log timer sessions for analytics
    logTimerSession(action) {
        try {
            let timerHistory = JSON.parse(localStorage.getItem('timerHistory') || '[]');
            
            const session = {
                id: Date.now(),
                action: action,
                timestamp: new Date().toISOString(),
                elapsedTime: this.elapsedTime,
                date: new Date().toISOString().split('T')[0]
            };
            
            timerHistory.push(session);
            
            // Keep only last 100 sessions
            if (timerHistory.length > 100) {
                timerHistory = timerHistory.slice(-100);
            }
            
            localStorage.setItem('timerHistory', JSON.stringify(timerHistory));
            
            // Update dashboard stats if needed
            this.updateTimerStats();
            
        } catch (error) {
            console.error('Error logging timer session:', error);
        }
    }
    
    // Update timer statistics on dashboard
    updateTimerStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const timerHistory = JSON.parse(localStorage.getItem('timerHistory') || '[]');
            
            // Calculate total time for today
            const todaySessions = timerHistory.filter(session => 
                session.date === today && session.action === 'stop'
            );
            
            const totalTodayTime = todaySessions.reduce((total, session) => {
                return total + session.elapsedTime;
            }, 0);
            
            // Update the stats card (assuming it's the third card)
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards[2]) {
                const numberElement = statCards[2].querySelector('.stat-number');
                if (numberElement) {
                    const hours = Math.floor(totalTodayTime / (1000 * 60 * 60));
                    const minutes = Math.floor((totalTodayTime % (1000 * 60 * 60)) / (1000 * 60));
                    numberElement.textContent = `${hours}h ${minutes}m`;
                }
            }
            
        } catch (error) {
            console.error('Error updating timer stats:', error);
        }
    }
    
    // Get timer statistics
    getTimerStats() {
        try {
            const timerHistory = JSON.parse(localStorage.getItem('timerHistory') || '[]');
            const today = new Date().toISOString().split('T')[0];
            
            // Today's sessions
            const todaySessions = timerHistory.filter(session => 
                session.date === today && session.action === 'stop'
            );
            
            // This week's sessions (last 7 days)
            const last7Days = Array.from({length: 7}, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            });
            
            const weekSessions = timerHistory.filter(session => 
                last7Days.includes(session.date) && session.action === 'stop'
            );
            
            // Calculate totals
            const todayTotal = todaySessions.reduce((sum, session) => sum + session.elapsedTime, 0);
            const weekTotal = weekSessions.reduce((sum, session) => sum + session.elapsedTime, 0);
            const avgDaily = weekTotal / 7;
            
            return {
                todayTotal: todayTotal,
                weekTotal: weekTotal,
                avgDaily: avgDaily,
                sessionsToday: todaySessions.length,
                sessionsThisWeek: weekSessions.length
            };
            
        } catch (error) {
            console.error('Error getting timer stats:', error);
            return {
                todayTotal: 0,
                weekTotal: 0,
                avgDaily: 0,
                sessionsToday: 0,
                sessionsThisWeek: 0
            };
        }
    }
    
    // Show timer history modal
    showTimerHistory() {
        const modal = this.createTimerHistoryModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
    
    // Create timer history modal
    createTimerHistoryModal() {
        const modal = document.createElement('div');
        modal.className = 'timer-history-modal';
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
        
        const stats = this.getTimerStats();
        const timerHistory = JSON.parse(localStorage.getItem('timerHistory') || '[]');
        const recentSessions = timerHistory.slice(-10).reverse();
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                ">
                    <h2 style="margin: 0; color: #333;">Timer History & Stats</h2>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                
                <div class="timer-stats" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                ">
                    <div class="stat-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">${this.formatTime(Math.floor(stats.todayTotal / 1000))}</div>
                        <div style="color: #666; font-size: 0.9rem;">Today</div>
                    </div>
                    <div class="stat-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">${this.formatTime(Math.floor(stats.weekTotal / 1000))}</div>
                        <div style="color: #666; font-size: 0.9rem;">This Week</div>
                    </div>
                    <div class="stat-item" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #FF9800;">${stats.sessionsToday}</div>
                        <div style="color: #666; font-size: 0.9rem;">Sessions Today</div>
                    </div>
                </div>
                
                <div class="recent-sessions">
                    <h3 style="margin-bottom: 1rem;">Recent Sessions</h3>
                    <div class="sessions-list">
                        ${recentSessions.map(session => `
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.75rem;
                                border-bottom: 1px solid #e0e0e0;
                            ">
                                <div>
                                    <div style="font-weight: 600;">${this.formatTime(Math.floor(session.elapsedTime / 1000))}</div>
                                    <div style="font-size: 0.8rem; color: #666;">
                                        ${new Date(session.timestamp).toLocaleDateString()} 
                                        ${new Date(session.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div style="
                                    background: ${session.action === 'stop' ? '#4CAF50' : '#FF9800'};
                                    color: white;
                                    padding: 0.25rem 0.5rem;
                                    border-radius: 4px;
                                    font-size: 0.8rem;
                                ">${session.action}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        });
        
        return modal;
    }
}

// Initialize timer manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.timerManager = new TimerManager();
});

// Export for use in other files
window.TimerManager = TimerManager;
