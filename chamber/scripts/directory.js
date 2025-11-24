// ===== Mobile Navigation Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

// Toggle menu function
function toggleMenu() {
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Event listeners for menu
menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== View Toggle Functionality =====
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const memberContainer = document.getElementById('memberContainer');

// Grid view event listener
gridViewBtn.addEventListener('click', () => {
    memberContainer.className = 'grid-view';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    localStorage.setItem('viewMode', 'grid');
});

// List view event listener
listViewBtn.addEventListener('click', () => {
    memberContainer.className = 'list-view';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    localStorage.setItem('viewMode', 'list');
});

// Load saved view preference
const savedView = localStorage.getItem('viewMode');
if (savedView === 'list') {
    listViewBtn.click();
}

// ===== Fetch and Display Members =====
const membersURL = 'data/members.json'; // Update this path to your JSON file

async function fetchMembers() {
    try {
        // Show loading state
        memberContainer.innerHTML = '<div class="loading">Loading members...</div>';
        
        const response = await fetch(membersURL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        displayMembers(data.members || data);
        
    } catch (error) {
        console.error('Error fetching members:', error);
        memberContainer.innerHTML = `
            <div class="no-members">
                <h3>Unable to Load Members</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Display members function
function displayMembers(members) {
    memberContainer.innerHTML = '';
    
    if (!members || members.length === 0) {
        memberContainer.innerHTML = `
            <div class="no-members">
                <h3>No Members Found</h3>
                <p>Check back soon for new members!</p>
            </div>
        `;
        return;
    }
    
    members.forEach(member => {
        const memberCard = createMemberCard(member);
        memberContainer.appendChild(memberCard);
    });
}

// Create member card element
function createMemberCard(member) {
    const card = document.createElement('div');
    card.classList.add('member-card');
    
    // Determine membership level class
    const levelClass = member.membershipLevel ? member.membershipLevel.toLowerCase() : 'basic';
    
    // Create card HTML
    card.innerHTML = `
        <img src="${member.image || 'images/placeholder.png'}" alt="${member.name} logo" loading="lazy">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p class="member-address">${member.address || 'Address not available'}</p>
            <p class="member-phone">${member.phone || 'Phone not available'}</p>
            ${member.website ? `<a href="${member.website}" target="_blank" rel="noopener noreferrer" class="member-url">Visit Website</a>` : ''}
        </div>
        <span class="membership-level ${levelClass}">${member.membershipLevel || 'Basic'}</span>
    `;
    
    return card;
}

// ===== Footer Dynamic Content =====
// Update current year
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Update last modified date
const lastModifiedSpan = document.getElementById('lastModified');
if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
}

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', () => {
    fetchMembers();
});

// ===== Sample JSON Structure (for reference) =====
/*
{
  "members": [
    {
      "name": "ABC Company",
      "address": "123 Main Street, Mukono",
      "phone": "+256-700-123-456",
      "website": "https://www.abccompany.com",
      "image": "images/abc-logo.png",
      "membershipLevel": "Gold"
    },
    {
      "name": "XYZ Business",
      "address": "456 Business Ave, Mukono",
      "phone": "+256-700-789-012",
      "website": "https://www.xyzbusiness.com",
      "image": "images/xyz-logo.png",
      "membershipLevel": "Silver"
    }
  ]
}
*/