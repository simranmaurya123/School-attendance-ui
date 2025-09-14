// Notification Bell functionality
class NotificationManager {
    constructor() {
        this.init();
    }

    init() {
        const notificationBell = document.getElementById('notificationBell');
        const notificationPopup = document.getElementById('notificationPopup');
        
        if (notificationBell && notificationPopup) {
            // Toggle popup on bell click
            notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationPopup.classList.toggle('show');
            });

            // Close popup when clicking outside
            document.addEventListener('click', (e) => {
                if (!notificationPopup.contains(e.target) && !notificationBell.contains(e.target)) {
                    notificationPopup.classList.remove('show');
                }
            });

            // Mark notification as read when clicked
            const notificationItems = document.querySelectorAll('.notification-item');
            notificationItems.forEach(item => {
                item.addEventListener('click', () => {
                    this.markAsRead(item);
                });
            });
        }
    }

    markAsRead(notificationItem) {
        notificationItem.classList.remove('unread');
        this.updateBadgeCount();
    }

    updateBadgeCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
}

// Initialize notifications when DOM is loaded
function initializeNotifications() {
    new NotificationManager();
}
