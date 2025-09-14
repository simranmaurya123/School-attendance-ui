// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Teacher Dashboard loaded successfully');
    
    // Initialize all components
    initializeDashboard();
    initializeSidebar();
    initializeTimer();
    initializeNotifications();
});

// Dashboard initialization
function initializeDashboard() {
    // Animate stats cards on load
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 200);
    });
    
    // Initialize new project button
    const newProjectBtn = document.querySelector('.new-project-btn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            showNotification('New project creation coming soon!', 'info');
        });
    }
}

// Sidebar functionality
function initializeSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation based on the clicked item
            const itemText = this.querySelector('span').textContent.trim();
            handleNavigation(itemText);
        });
    });
}

// Navigation handler
function handleNavigation(section) {
    console.log(`Navigating to: ${section}`);
    
    switch(section) {
        case 'Dashboard':
            showDashboardContent();
            break;
        case 'Report Overview':
            showReportOverview();
            break;
        case 'Images':
            showImagesSection();
            break;
        case 'Manage Task':
            showTaskManagement();
            break;
        case 'Settings':
            showSettings();
            break;
        default:
            showNotification(`${section} section coming soon!`, 'info');
    }
}

// Content display functions
function showDashboardContent() {
    // Dashboard is already visible, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showReportOverview() {
    showNotification('Report Overview feature coming soon!', 'info');
}

function showImagesSection() {
    showNotification('Images management coming soon!', 'info');
}

function showTaskManagement() {
    showNotification('Task management feature coming soon!', 'info');
}

function showSettings() {
    showNotification('Settings panel coming soon!', 'info');
}

// Notification system
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Update stats periodically
setInterval(() => {
    updateDashboardStats();
}, 30000); // Update every 30 seconds

function updateDashboardStats() {
    // Simulate dynamic stats updates
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Add some animation to show data is being updated
    statNumbers.forEach(stat => {
        stat.style.transform = 'scale(1.1)';
        setTimeout(() => {
            stat.style.transform = 'scale(1)';
        }, 200);
    });
}

// Export functions for use in other files
window.TeacherDashboard = {
    showNotification,
    formatTime,
    getCurrentDate,
    getCurrentTime,
    handleNavigation
};
