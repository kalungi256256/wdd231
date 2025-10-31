// Course data array
const courses = [{
        code: 'WDD 130',
        title: 'Web Fundamentals',
        credits: 3,
        description: 'Introduction to web development technologies including HTML and CSS.',
        completed: true,
        pending: false
    },
    {
        code: 'WDD 131',
        title: 'Dynamic Web Fundamentals',
        credits: 3,
        description: 'Building dynamic websites with JavaScript and DOM manipulation.',
        completed: true,
        pending: false
    },
    {
        code: 'WDD 231',
        title: 'Web Frontend Development I',
        credits: 2,
        description: 'Advanced frontend development with modern frameworks and tools.',
        completed: false,
        pending: true
    },
    {
        code: 'WDD 330',
        title: 'Web Frontend Development II',
        credits: 3,
        description: 'Progressive web applications and advanced JavaScript patterns.',
        completed: false,
        pending: false
    },
    {
        code: 'CSE 110',
        title: 'Programming Building Blocks',
        credits: 3,
        description: 'Introduction to programming concepts and problem solving.',
        completed: true,
        pending: false
    },
    {
        code: 'CSE 111',
        title: 'Programming with Functions',
        credits: 3,
        description: 'Functional programming concepts and advanced data structures.',
        completed: true,
        pending: false
    },
    {
        code: 'CSE 210',
        title: 'Programming with Classes',
        credits: 3,
        description: 'Object-oriented programming principles and design patterns.',
        completed: false,
        pending: true
    }
];

// DOM elements
const coursesContainer = document.querySelector('.courses-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCreditsElement = document.getElementById('total-credits');
const coursesCountElement = document.getElementById('courses-count');
const currentYearElement = document.getElementById('current-year');
const lastModifiedElement = document.getElementById('last-modified');

// Initialize the application
function init() {
    displayCourses(courses);
    setupEventListeners();
    updateFooterInfo();
    updateSummary();
}

// Display courses in the DOM
function displayCourses(coursesToDisplay) {
    coursesContainer.innerHTML = '';

    if (coursesToDisplay.length === 0) {
        coursesContainer.innerHTML = '<p class="no-courses">No courses found matching your filter.</p>';
        return;
    }

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : ''} ${course.pending ? 'pending' : ''}`.trim();

        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-code">${course.code}</div>
                <div class="course-credits">${course.credits} credits</div>
            </div>
            <div class="course-title">${course.title}</div>
            <div class="course-description">${course.description}</div>
            ${course.completed ? '<div class="course-completed">Completed</div>' : ''}
            ${(!course.completed && course.pending) ? '<div class="course-pending">Pending</div>' : ''}
        `;

        coursesContainer.appendChild(courseCard);
    });
}

// Filter courses based on selection
function filterCourses(filter) {
    let filteredCourses;

    switch (filter) {
        case 'all':
            filteredCourses = courses;
            break;
        case 'wdd':
            filteredCourses = courses.filter(course => course.code.startsWith('WDD'));
            break;
        case 'cse':
            filteredCourses = courses.filter(course => course.code.startsWith('CSE'));
            break;
        case 'pending':
            filteredCourses = courses.filter(course => course.pending);
            break;
        case 'completed':
            filteredCourses = courses.filter(course => course.completed);
            break;
        case 'future':
            filteredCourses = courses.filter(course => !course.completed && !course.pending);
            break;
        default:
            filteredCourses = courses;
    }

    displayCourses(filteredCourses);
    updateSummary(filteredCourses);
}

// Update course summary information
function updateSummary(filteredCourses = courses) {
    const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);

    totalCreditsElement.textContent = totalCredits;
    coursesCountElement.textContent = filteredCourses.length;
}

// Set up event listeners
function setupEventListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            e.target.classList.add('active');

            // Filter courses
            const filter = e.target.getAttribute('data-filter');
            filterCourses(filter);
        });
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.getElementById('main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('open');
        });

        // Close nav when a link is clicked (mobile UX)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Close nav when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        const hamburger = document.querySelector('.hamburger');
        const mainNav = document.getElementById('main-nav');

        if (window.innerWidth <= 768 && mainNav && hamburger &&
            !mainNav.contains(e.target) && !hamburger.contains(e.target) &&
            mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Update footer information
function updateFooterInfo() {
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);