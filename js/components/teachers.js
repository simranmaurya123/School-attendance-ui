// Teachers page functionality

// Sample teacher data - in a real application, this would come from an API
const teachersData = [
    {
        id: 1,
        name: "Shweta Singh",
        subject: "Mathematics [MATH101]",
        department: "mathematics",
        email: "shweta.singh@university.edu",
        phone: "+91 98765 43210"
    },
    {
        id: 2,
        name: "Amit Kumar",
        subject: "INFORMATION TECHNOLOGY [IT101]",
        department: "computer-science",
        email: "amit.kumar@university.edu",
        phone: "+91 98765 43211"
    },
    {
        id: 5,
        name: "Rahul Sharma",
        subject: "Science [SCI101]",
        department: "science",
        email: "rahul.sharma@university.edu",
        phone: "+91 98765 43214"
    },
    {
        id: 6,
        name: "Richa Sharma",
        subject: "English [ENG101]",
        department:"English",
        email: "richa.sharma@university.edu",
        phone: "+91 98765 43215"
    }
];

let currentFilter = 'all';

function initializeTeachers() {
    renderTeachers(teachersData);
}

function renderTeachers(teachers) {
    const teachersGrid = document.getElementById('teachersGrid');
    
    if (teachers.length === 0) {
        teachersGrid.innerHTML = `
            <div class="empty-state">
                <h3>No teachers found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    teachersGrid.innerHTML = teachers.map(teacher => `
        <div class="teacher-card" data-department="${teacher.department}">
            <div class="department-badge">${getDepartmentName(teacher.department)}</div>
            <div class="teacher-info">
                <div class="teacher-details">
                    <h3 class="teacher-name">${teacher.name}</h3>
                    <div class="teacher-subject">${teacher.subject}</div>
                    <div class="teacher-contact">
                        <div class="contact-item">
                            <span class="contact-label">Email:</span>
                            <span class="contact-text">
                                <a href="mailto:${teacher.email}" class="contact-link">${teacher.email}</a>
                            </span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-label">Contact:</span>
                            <span class="contact-text">
                                <a href="tel:${teacher.phone}" class="contact-link">${teacher.phone}</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the department filter
            const department = button.getAttribute('data-department');
            currentFilter = department;
            
            // Filter and render teachers
            filterTeachers();
        });
    });
}

function filterTeachers() {
    // Just render all teachers since search is removed
    renderTeachers(teachersData);
}

function getDepartmentName(department) {
    const departmentNames = {
        'computer-science': 'CS',
        'mathematics': 'MATH',
        'physics': 'PHY',
        'chemistry': 'CHEM'
    };
    
    return departmentNames[department] || 'OTHER';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTeachers);
} else {
    initializeTeachers();
}
