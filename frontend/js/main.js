// Main JavaScript file for dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeCourses();
    initializeCalendar();
    initializeProgress();
});

// Handle responsive sidebar
const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
};

// Search functionality
const searchBar = document.querySelector('.search-bar input');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality here
});
