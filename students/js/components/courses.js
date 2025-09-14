// Course data and functionality
const courses = [
    {
        title: 'Computer Science',
        duration: '8 weeks',
        image: 'images/avatar.jpg',
        students: ['images/avatar.jpg', 'images/avatar.jpg', 'images/avatar.jpg']
    },
    {
        title: 'Mathematics',
        duration: '12 weeks',
        image: 'images/avatar.jpg',
        students: ['images/avatar.jpg', 'images/avatar.jpg']
    },
    {
        title: 'Physics',
        duration: '6 weeks',
        image: 'images/avatar.jpg',
        students: ['images/avatar.jpg', 'images/avatar.jpg', 'images/avatar.jpg']
    }
];

function initializeCourses() {
    const courseContainer = document.querySelector('.course-cards');
    
    courses.forEach(course => {
        const courseElement = createCourseCard(course);
        courseContainer.appendChild(courseElement);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    card.innerHTML = `
        <img src="${course.image}" alt="${course.title}" class="course-image">
        <h3 class="course-title">${course.title}</h3>
        <div class="course-info">
            <span class="duration">${course.duration}</span>
            <div class="course-students">
                <div class="student-avatars">
                    ${course.students.map(student => 
                        `<img src="${student}" alt="Student">`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    return card;
}
