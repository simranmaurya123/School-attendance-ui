// Course list data and functionality
const myCourses = [
    {
        name: 'Maths',
        code:'[MATH101]',
        Teacher:'Shweta Singh'    },
    {
        name: 'Science',
        code:'[SCI101]',
        Teacher:'Rahul Sharma'
    },
    {
        name: 'IT',
        code:'[IT101]',
        Teacher:'Amit Kumar'
    },
    {
        name: 'English',
        code:'[ENG101]',
        Teacher:'Richa Sharma'
    }
    
];

function initializeMyCourses() {
    console.log('Initializing My Courses...');
    const courseListContainer = document.querySelector('.my-courses .course-list');
    console.log('Course container found:', courseListContainer);
    
    if (!courseListContainer) return;

    // Clear existing content first
    courseListContainer.innerHTML = '';

    myCourses.forEach(course => {
        console.log('Creating course element for:', course.name);
        const courseElement = createCourseElement(course);
        courseListContainer.appendChild(courseElement);
    });
    
    console.log('My Courses initialized successfully');
}

function createCourseElement(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-item';
    
    courseDiv.innerHTML = `
        <div class="course-details">
            <div class="course-info-row">
                <span class="course-name">${course.name}</span>
                <span class="course-code">${course.code}</span>
            </div>
            <div class="course-teacher">
                ${course.Teacher}
            </div>
        </div>
    `;
    
    return courseDiv;
}


