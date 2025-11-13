// DOM Elements (use fallbacks because directory script is used on multiple pages)
const memberContainer = document.getElementById('memberContainer') || document.getElementById('directory') || document.querySelector('.member-container');
const gridViewBtn = document.getElementById('gridView') || document.getElementById('gridBtn');
const listViewBtn = document.getElementById('listView') || document.getElementById('listBtn');
const menuToggle = document.querySelector('.menu-toggle') || document.getElementById('menuButton') || document.getElementById('hamburger-btn');
const navMenu = document.querySelector('.nav-menu') || document.getElementById('navMenu') || document.getElementById('nav-menu');

// Current year and last modified (set if elements exist)
const currentYearEl = document.getElementById('currentYear') || document.getElementById('current-year') || document.getElementById('year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
const lastModifiedEl = document.getElementById('lastModified') || document.getElementById('last-modified');
if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

// Mobile menu toggle (guard if controls exist)
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        const isExpanded = navMenu.classList.contains('show');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Fetch members data
async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Support two shapes: an array directly, or { members: [...] }
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.members)) return data.members;
        console.warn('Unexpected members.json format — expected array or { members: [...] }');
        return [];
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
}

// Display members in grid view
function displayGridMembers(members) {
    memberContainer.className = 'grid-view';
    memberContainer.innerHTML = '';

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        const membershipText = getMembershipLevel(member.membershipLevel);

        // Resolve image source: accept absolute URLs, paths starting with '/', or plain filenames
        let imgSrc = member.image || 'images/placeholder.svg';
        if (!/^https?:\/\//i.test(imgSrc) && !imgSrc.startsWith('/') && !imgSrc.startsWith('images/')) {
            imgSrc = `images/${imgSrc}`;
        }

        memberCard.innerHTML = `
            <img src="${imgSrc}" alt="${member.name}" loading="lazy" onerror="this.onerror=null;this.src='images/placeholder.svg';">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
            <p>Category: ${member.category}</p>
            <span class="membership-level ${membershipText.toLowerCase()}">${membershipText} Member</span>
        `;

        memberContainer.appendChild(memberCard);
    });
}

// Display members in list view
function displayListMembers(members) {
    memberContainer.className = 'list-view';
    memberContainer.innerHTML = '';

    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';

        const membershipText = getMembershipLevel(member.membershipLevel);

        memberItem.innerHTML = `
            <div>
                <h3>${member.name}</h3>
                <span class="membership-level ${membershipText.toLowerCase()}">${membershipText}</span>
            </div>
            <div>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p>${member.category}</p>
            </div>
            <div>
                <a href="${member.website}" target="_blank">Website</a>
            </div>
        `;

        memberContainer.appendChild(memberItem);
    });
}

// Get membership level text
function getMembershipLevel(level) {
    switch (level) {
        case 3:
            return 'Gold';
        case 2:
            return 'Silver';
        case 1:
            return 'Member';
        default:
            return 'Member';
    }
}

// View toggle functionality
gridViewBtn.addEventListener('click', async() => {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    const members = await fetchMembers();
    displayGridMembers(members);
});

listViewBtn.addEventListener('click', async() => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    const members = await fetchMembers();
    displayListMembers(members);
});

// Initialize page
async function init() {
    const members = await fetchMembers();
    displayGridMembers(members);
}

// Start the application
init();