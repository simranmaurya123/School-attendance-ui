/**
 * Layout Loader - Handles dynamic loading of layout components
 * This file manages the modular loading of sidebar, main content, and right panel
 */

class LayoutLoader {
    constructor() {
        this.components = {
            sidebar: 'layouts/sidebar.html',
            mainContent: 'layouts/main-content.html',
            rightPanel: 'layouts/right-panel.html'
        };
        
        this.containers = {
            sidebar: 'sidebarContainer',
            mainContent: 'mainContainer',
            rightPanel: 'rightPanelContainer'
        };
        
        this.loadingStates = {};
        this.initialized = false;
    }

    /**
     * Initialize the layout loader
     */
    async init() {
        if (this.initialized) return;
        
        try {
            // Show loading states
            this.showLoadingStates();
            
            // Load all components in parallel for better performance
            await Promise.all([
                this.loadComponent('sidebar'),
                this.loadComponent('mainContent'),
                this.loadComponent('rightPanel')
            ]);
            
            // Initialize components after loading
            await this.initializeComponents();
            
            this.initialized = true;
            this.onLayoutLoaded();
            
        } catch (error) {
            console.error('Error initializing layout:', error);
            this.showErrorState();
        }
    }

    /**
     * Load a specific component
     */
    async loadComponent(componentName) {
        const componentPath = this.components[componentName];
        const containerId = this.containers[componentName];
        
        if (!componentPath || !containerId) {
            throw new Error(`Invalid component: ${componentName}`);
        }

        try {
            this.setLoadingState(componentName, 'loading');
            
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status}`);
            }
            
            const html = await response.text();
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                this.setLoadingState(componentName, 'loaded');
            } else {
                throw new Error(`Container not found: ${containerId}`);
            }
            
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            this.setLoadingState(componentName, 'error');
            this.showFallbackContent(componentName);
        }
    }

    /**
     * Show loading states for all containers
     */
    showLoadingStates() {
        Object.entries(this.containers).forEach(([component, containerId]) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = this.getLoadingHTML(component);
            }
        });
    }

    /**
     * Set loading state for a component
     */
    setLoadingState(component, state) {
        this.loadingStates[component] = state;
        console.log(`${component}: ${state}`);
    }

    /**
     * Get loading HTML for a component
     */
    getLoadingHTML(component) {
        const messages = {
            sidebar: 'Loading navigation...',
            mainContent: 'Loading dashboard content...',
            rightPanel: 'Loading widgets...'
        };

        return `
            <div class="loading-state">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-message">
                    ${messages[component] || 'Loading...'}
                </div>
            </div>
        `;
    }

    /**
     * Show fallback content when loading fails
     */
    showFallbackContent(componentName) {
        const containerId = this.containers[componentName];
        const container = document.getElementById(containerId);
        
        if (!container) return;

        const fallbackContent = this.getFallbackContent(componentName);
        container.innerHTML = fallbackContent;
    }

    /**
     * Get fallback content for each component
     */
    getFallbackContent(componentName) {
        const fallbacks = {
            sidebar: `
                <div class="sidebar fallback-sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Teacher Dashboard</span>
                        </div>
                    </div>
                    <div class="fallback-message">
                        <p>Navigation temporarily unavailable</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-refresh"></i> Reload
                        </button>
                    </div>
                </div>
            `,
            mainContent: `
                <main class="main-content fallback-content">
                    <div class="fallback-dashboard">
                        <h2><i class="fas fa-exclamation-triangle"></i> Content Loading Error</h2>
                        <p>Unable to load dashboard content. Please refresh the page.</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-refresh"></i> Refresh Page
                        </button>
                    </div>
                </main>
            `,
            rightPanel: `
                <aside class="right-panel fallback-panel">
                    <div class="fallback-message">
                        <h4>Panel Unavailable</h4>
                        <p>Unable to load side panel content.</p>
                        <button onclick="layoutLoader.loadComponent('rightPanel')" class="btn btn-secondary">
                            <i class="fas fa-refresh"></i> Retry
                        </button>
                    </div>
                </aside>
            `
        };

        return fallbacks[componentName] || '<div>Component unavailable</div>';
    }

    /**
     * Initialize components after loading
     */
    async initializeComponents() {
        // Initialize sidebar functionality
        this.initializeSidebar();
        
        // Initialize calendar
        this.initializeCalendar();
        
        // Initialize event handlers
        this.attachEventHandlers();
        
        // Animate components
        this.animateComponents();
    }

    /**
     * Initialize sidebar functionality
     */
    initializeSidebar() {
        // Navigation item clicks
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!item.classList.contains('submenu-item')) {
                    // Remove active from all nav items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    // Add active to clicked item
                    item.classList.add('active');
                }
            });
        });

        // Submenu toggles
        const submenuToggles = document.querySelectorAll('[onclick*="toggleSubmenu"]');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const submenuId = toggle.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.toggleSubmenu(submenuId);
            });
        });
    }

    /**
     * Toggle submenu visibility
     */
    toggleSubmenu(submenuId) {
        const submenu = document.getElementById(submenuId + 'Submenu');
        if (submenu) {
            submenu.classList.toggle('open');
            
            // Rotate chevron
            const chevron = submenu.previousElementSibling?.querySelector('.chevron');
            if (chevron) {
                chevron.style.transform = submenu.classList.contains('open') 
                    ? 'rotate(180deg)' 
                    : 'rotate(0deg)';
            }
        }
    }

    /**
     * Initialize calendar functionality
     */
    initializeCalendar() {
        this.generateCalendar();
        this.attachCalendarEvents();
    }

    /**
     * Generate calendar for current month
     */
    generateCalendar() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const today = currentDate.getDate();
        
        // Update month header
        const monthHeader = document.getElementById('currentMonth');
        if (monthHeader) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            monthHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
        
        // Generate calendar days
        const calendarDays = document.getElementById('calendarDays');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // Sample attendance data (you can replace with real data)
        const attendanceData = {
            1: 'present', 2: 'present', 4: 'present', 5: 'present', 6: 'absent',
            7: 'present', 8: 'present', 9: 'present', 10: 'absent', 11: 'present',
            12: 'present', 15: 'absent', 16: 'present', 17: 'present', 18: 'absent',
            19: 'present', 20: 'present'
        };
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(daysInPrevMonth - i, 'prev-month');
            calendarDays.appendChild(dayElement);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const classes = [];
            
            // Highlight today with black circle
            if (day === today && currentMonth === 8 && currentYear === 2025) { // September 2025
                classes.push('today');
            }
            // Add attendance status
            else if (attendanceData[day]) {
                classes.push(attendanceData[day]);
            }
            
            const dayElement = this.createDayElement(day, classes.join(' '));
            calendarDays.appendChild(dayElement);
        }
        
        // Add next month's leading days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'next-month');
            calendarDays.appendChild(dayElement);
        }
    }

    /**
     * Create a day element for the calendar
     */
    createDayElement(day, className = '') {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${className}`;
        dayElement.textContent = day;
        
        // Add click handler for attendance days
        if (className.includes('present') || className.includes('absent')) {
            dayElement.title = `Attendance: ${className.includes('present') ? 'Present' : 'Absent'}`;
            dayElement.addEventListener('click', () => {
                this.showDayDetails(day, className);
            });
        } else if (className.includes('today')) {
            dayElement.title = 'Today';
        }
        
        return dayElement;
    }

    /**
     * Attach calendar navigation events
     */
    attachCalendarEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateMonth(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateMonth(1);
            });
        }
    }

    /**
     * Navigate to previous or next month
     */
    navigateMonth(direction) {
        // For now, just show a notification
        const monthName = direction === -1 ? 'previous' : 'next';
        this.showNotification(`${monthName} month navigation coming soon!`, 'info');
    }

    /**
     * Show details for a specific day
     */
    showDayDetails(day, className = '') {
        if (className.includes('present')) {
            this.showNotification(`Day ${day}: Classes attended successfully`, 'success');
        } else if (className.includes('absent')) {
            this.showNotification(`Day ${day}: Some classes were missed`, 'warning');
        } else {
            this.showNotification(`View details for day ${day}`, 'info');
        }
    }

    /**
     * Attach event handlers
     */
    attachEventHandlers() {
        // Quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.querySelector('span').textContent;
                this.handleQuickAction(action);
            });
        });

        // Table action buttons
        const tableBtns = document.querySelectorAll('.btn-icon');
        tableBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('title');
                this.handleTableAction(action, btn);
            });
        });

        // Notification actions
        const notificationBtns = document.querySelectorAll('.btn-link');
        notificationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleNotificationAction(btn);
            });
        });
    }

    /**
     * Handle quick action button clicks
     */
    handleQuickAction(action) {
        const actions = {
            'Mark Attendance': () => this.openAttendanceModal('mark'),
            'Update Records': () => this.openAttendanceModal('update'),
            'View Analytics': () => this.openAttendanceModal('monitor'),
            'Export Data': () => this.exportData()
        };

        if (actions[action]) {
            actions[action]();
        } else {
            this.showNotification(`${action} feature coming soon!`, 'info');
        }
    }

    /**
     * Handle table action clicks
     */
    handleTableAction(action, button) {
        const row = button.closest('.table-row');
        const className = row?.querySelector('.class-name')?.textContent || 'Unknown';
        
        if (action === 'Edit') {
            this.openAttendanceModal('update', className);
        } else if (action === 'View') {
            this.viewClassDetails(className);
        }
    }

    /**
     * Handle notification actions
     */
    handleNotificationAction(button) {
        if (button.textContent.includes('Mark all read')) {
            this.markAllNotificationsRead();
        }
    }

    /**
     * Animate components on load
     */
    animateComponents() {
        // Animate stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate table rows
        const tableRows = document.querySelectorAll('.table-row');
        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.4s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 200 + (index * 50));
        });
    }

    /**
     * Show error state
     */
    showErrorState() {
        const containers = Object.values(this.containers);
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Loading Error</h3>
                        <p>Unable to load dashboard components.</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            <i class="fas fa-refresh"></i> Reload Page
                        </button>
                    </div>
                `;
            }
        });
    }

    /**
     * Called when layout is successfully loaded
     */
    onLayoutLoaded() {
        console.log('Layout loaded successfully');
        
        // Show success notification
        setTimeout(() => {
            this.showNotification('Dashboard loaded successfully!', 'success');
        }, 500);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('layoutLoaded', {
            detail: { loadingStates: this.loadingStates }
        }));
    }

    /**
     * Utility methods
     */
    openAttendanceModal(type, className = '') {
        if (typeof openModal === 'function') {
            openModal(type, className);
        } else {
            this.showNotification(`${type} attendance modal coming soon!`, 'info');
        }
    }

    exportData() {
        this.showNotification('Export functionality coming soon!', 'info');
    }

    viewClassDetails(className) {
        this.showNotification(`Viewing details for ${className}`, 'info');
    }

    markAllNotificationsRead() {
        const notifications = document.querySelectorAll('.notification-item');
        notifications.forEach(notification => {
            notification.style.opacity = '0.5';
        });
        this.showNotification('All notifications marked as read', 'success');
    }

    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Create global instance
const layoutLoader = new LayoutLoader();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutLoader;
}
