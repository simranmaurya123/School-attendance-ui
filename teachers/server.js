const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from current directory
app.use(express.static(__dirname));

// Route for the main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher-dashboard.html'));
});

// Route for the dashboard (alternative path)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher-dashboard.html'));
});

// API endpoint for attendance data (future enhancement)
app.get('/api/attendance', (req, res) => {
    res.json({
        message: 'Attendance API endpoint',
        data: {
            totalClasses: 3,
            averageAttendance: '96%',
            totalStudents: 76,
            absenteesToday: 3
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🎓 Teacher Dashboard Server is running!`);
    console.log(`📍 Main URL: http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔗 API: http://localhost:${PORT}/api/attendance`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

module.exports = app;
