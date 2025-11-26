// Course data array
const courses = [{
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// DOM elements
const coursesContainer = document.getElementById('courses-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCreditsElement = document.getElementById('total-credits');

// Initialize courses
document.addEventListener('DOMContentLoaded', function() {
    displayCourses(courses);
    setupFilterListeners();
    updateCreditsSummary(courses);
});

// Display courses
function displayCourses(coursesToDisplay) {
    coursesContainer.innerHTML = '';

    if (coursesToDisplay.length === 0) {
        coursesContainer.innerHTML = '<p class="no-courses">No courses found matching your selection.</p>';
        return;
    }

    coursesToDisplay.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;

                courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-code">${course.subject} ${course.number}</div>
                <div class="course-credits">${course.credits} credits</div>
            </div>
            <div class="course-title">${course.title}</div>
            <div class="course-description">${course.description}</div>
            <div class="course-technology">
                ${course.technology.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="course-status ${course.completed ? 'status-completed' : 'status-pending'}">
                ${course.completed ? 'Completed' : 'Not Completed'}
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
}

// Setup filter listeners
function setupFilterListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter courses
            const filter = this.getAttribute('data-filter');
            filterCourses(filter);
        });
    });
}

// Filter courses
function filterCourses(filter) {
    let filteredCourses;
    
    switch (filter) {
        case 'all':
            filteredCourses = courses;
            break;
        case 'WDD':
            filteredCourses = courses.filter(course => course.subject === 'WDD');
            break;
        case 'CSE':
            filteredCourses = courses.filter(course => course.subject === 'CSE');
            break;
        default:
            filteredCourses = courses;
    }
    
    displayCourses(filteredCourses);
    updateCreditsSummary(filteredCourses);
}

// Update credits summary
function updateCreditsSummary(coursesToDisplay) {
    const totalCredits = coursesToDisplay.reduce((total, course) => {
        return total + course.credits;
    }, 0);
    
    if (totalCreditsElement) {
        totalCreditsElement.textContent = totalCredits;
    }
}
function updateFooter(){
    // Current Year import
    const yearSpan = document.getElementById('current-year');
    if (yearSpan){
     yearSpan.textContent = new Date().getFullYear();
    }

    // Last modified content
    const modifiedSpan = document.getElementById('last-Modified');
        if (modifiedSpan) {
            modifiedSpan.textContent = document.lastModified

        }
    
}