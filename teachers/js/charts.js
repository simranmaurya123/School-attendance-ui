// Charts and Analytics for Teacher Dashboard
class ChartManager {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        console.log('Chart Manager initialized');
        this.loadChartLibrary();
    }
    
    // Load Chart.js library dynamically
    loadChartLibrary() {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                console.log('Chart.js loaded successfully');
                this.initializeCharts();
            };
            document.head.appendChild(script);
        } else {
            this.initializeCharts();
        }
    }
    
    // Initialize all charts
    initializeCharts() {
        // Wait for attendance manager to be available
        setTimeout(() => {
            this.createAttendanceTrendChart();
            this.createSubjectAttendanceChart();
            this.createDailyAttendanceChart();
        }, 1000);
    }
    
    // Create attendance trend chart
    createAttendanceTrendChart() {
        const canvas = this.createCanvas('attendanceTrendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Sample data for the last 7 days
        const last7Days = this.getLast7Days();
        const attendanceData = this.getAttendanceDataForDays(last7Days);
        
        this.charts.attendanceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => this.formatDate(date)),
                datasets: [{
                    label: 'Attendance Percentage',
                    data: attendanceData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Attendance Trend (Last 7 Days)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#333'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });
    }
    
    // Create subject-wise attendance chart
    createSubjectAttendanceChart() {
        const canvas = this.createCanvas('subjectAttendanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Sample subject data
        const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
        const attendanceRates = [92, 88, 95, 85, 90];
        
        this.charts.subjectAttendance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Attendance Rate (%)',
                    data: attendanceRates,
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#9C27B0',
                        '#F44336'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Subject-wise Attendance',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#333'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create daily attendance distribution chart
    createDailyAttendanceChart() {
        const canvas = this.createCanvas('dailyAttendanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Get today's attendance data
        const stats = window.attendanceManager ? 
            window.attendanceManager.getAttendanceStats() : 
            { presentStudents: 25, absentStudents: 3, lateStudents: 2 };
        
        this.charts.dailyAttendance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                    data: [stats.presentStudents, stats.absentStudents, stats.lateStudents],
                    backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
                    borderWidth: 0,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Today\'s Attendance Distribution',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#333',
                        padding: {
                            bottom: 20
                        }
                    }
                }
            }
        });
    }
    
    // Helper function to create canvas element
    createCanvas(id) {
        // Check if canvas already exists
        let canvas = document.getElementById(id);
        if (canvas) return canvas;
        
        // Create canvas element
        canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.style.cssText = `
            width: 100%;
            height: 300px;
            margin: 1rem 0;
        `;
        
        // Find appropriate container
        const container = this.findChartContainer(id);
        if (container) {
            container.appendChild(canvas);
            return canvas;
        }
        
        return null;
    }
    
    // Find appropriate container for chart
    findChartContainer(chartId) {
        // Create a charts section if it doesn't exist
        let chartsSection = document.querySelector('.charts-section');
        
        if (!chartsSection) {
            chartsSection = document.createElement('div');
            chartsSection.className = 'charts-section';
            chartsSection.style.cssText = `
                background: white;
                border-radius: 16px;
                padding: 1.5rem;
                margin: 2rem 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            `;
            
            // Insert after time report section
            const timeReportSection = document.querySelector('.time-report-section');
            if (timeReportSection) {
                timeReportSection.parentNode.insertBefore(chartsSection, timeReportSection.nextSibling);
            } else {
                // Fallback: append to main content
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.appendChild(chartsSection);
                }
            }
        }
        
        return chartsSection;
    }
    
    // Get last 7 days
    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    }
    
    // Get attendance data for specific days
    getAttendanceDataForDays(days) {
        if (!window.attendanceManager) {
            // Return sample data if attendance manager is not available
            return [88, 92, 85, 90, 94, 87, 91];
        }
        
        return days.map(day => {
            const dayRecords = window.attendanceManager.attendanceRecords.filter(record => record.date === day);
            if (dayRecords.length === 0) {
                return Math.floor(Math.random() * 20) + 80; // Random between 80-100
            }
            
            const latestRecord = dayRecords[dayRecords.length - 1];
            const present = latestRecord.students.filter(s => s.status === 'present').length;
            const total = latestRecord.students.length;
            
            return Math.round((present / total) * 100);
        });
    }
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Update charts with new data
    updateCharts() {
        if (this.charts.attendanceTrend) {
            const last7Days = this.getLast7Days();
            const attendanceData = this.getAttendanceDataForDays(last7Days);
            
            this.charts.attendanceTrend.data.labels = last7Days.map(date => this.formatDate(date));
            this.charts.attendanceTrend.data.datasets[0].data = attendanceData;
            this.charts.attendanceTrend.update();
        }
        
        if (this.charts.dailyAttendance && window.attendanceManager) {
            const stats = window.attendanceManager.getAttendanceStats();
            this.charts.dailyAttendance.data.datasets[0].data = [
                stats.presentStudents, 
                stats.absentStudents, 
                stats.lateStudents
            ];
            this.charts.dailyAttendance.update();
        }
    }
    
    // Show analytics modal
    showAnalyticsModal() {
        const modal = this.createAnalyticsModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
    
    // Create analytics modal
    createAnalyticsModal() {
        const modal = document.createElement('div');
        modal.className = 'analytics-modal';
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
                max-width: 900px;
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
                    <h2 style="margin: 0; color: #333;">Attendance Analytics</h2>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                
                <div class="charts-grid" style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 2rem;
                ">
                    <div class="chart-container">
                        <canvas id="modalTrendChart" style="width: 100%; height: 250px;"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="modalSubjectChart" style="width: 100%; height: 250px;"></canvas>
                    </div>
                </div>
                
                <div class="analytics-summary" style="
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                ">
                    <h3 style="margin-top: 0;">Summary</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div class="summary-item">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">92%</div>
                            <div style="color: #666;">Average Attendance</div>
                        </div>
                        <div class="summary-item">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">5</div>
                            <div style="color: #666;">Classes This Week</div>
                        </div>
                        <div class="summary-item">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #FF9800;">3</div>
                            <div style="color: #666;">Late Students Today</div>
                        </div>
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

// Initialize chart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chartManager = new ChartManager();
});

// Export for use in other files
window.ChartManager = ChartManager;
