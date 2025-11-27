// ========================================
// DISCOVER PAGE - COMPLETE FUNCTIONALITY
// ========================================

let attractionsData = [];

document.addEventListener('DOMContentLoaded', () => {
    trackVisit();
    fetchAttractions();
    setupViewToggle();
});

// ========================================
// VISIT TRACKER FUNCTIONALITY
// ========================================

function trackVisit() {
    const visitMessageEl = document.getElementById('visit-message');
    const daysSinceEl = document.getElementById('days-since');
    
    if (!visitMessageEl || !daysSinceEl) {
        console.error('Visit tracker elements not found');
        return;
    }
    
    try {
        // Get stored visit data from localStorage
        const lastVisit = localStorage.getItem('lastVisit');
        const currentDate = Date.now();
        
        if (!lastVisit) {
            // First visit
            visitMessageEl.textContent = "Welcome! This is your first visit to our Discover page. 🎉";
            daysSinceEl.textContent = "0";
        } else {
            // Calculate days since last visit
            const lastVisitDate = parseInt(lastVisit);
            const timeDiff = currentDate - lastVisitDate;
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                // Same day visit
                visitMessageEl.textContent = "Welcome back! You visited earlier today. 👋";
                daysSinceEl.textContent = "0";
            } else if (daysDiff === 1) {
                // Visited yesterday
                visitMessageEl.textContent = "Great to see you again! You last visited yesterday. 😊";
                daysSinceEl.textContent = "1";
            } else {
                // Multiple days ago
                visitMessageEl.textContent = `Welcome back! You last visited ${daysDiff} days ago. 🌟`;
                daysSinceEl.textContent = daysDiff.toString();
            }
        }
        
        // Store current visit timestamp
        localStorage.setItem('lastVisit', currentDate.toString());
    } catch (error) {
        console.error('localStorage error:', error);
        visitMessageEl.textContent = "Welcome to our Discover page! 👋";
        daysSinceEl.textContent = "0";
    }
}


// ========================================
// FETCH ATTRACTIONS FROM JSON
// ========================================

async function fetchAttractions() {
    const container = document.getElementById('attractionCards');
    
    if (!container) {
        console.error('Attraction cards container not found');
        return;
    }
    
    try {
        const response = await fetch('data/attractions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        attractionsData = await response.json();
        
        if (!Array.isArray(attractionsData) || attractionsData.length === 0) {
            throw new Error('Invalid attractions data format');
        }
        
        displayAttractions(attractionsData);
    } catch (error) {
        console.error('Error fetching attractions data:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #e76f51; font-size: 1.1rem; margin-bottom: 1rem;">
                    ⚠️ Unable to load attractions data
                </p>
                <p style="color: #666; font-size: 0.95rem;">
                    Error: ${error.message}
                </p>
                <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">
                    Please ensure the file <strong>data/attractions.json</strong> exists and is properly formatted.
                </p>
            </div>
        `;
    }
}


// ========================================
// DISPLAY ATTRACTION CARDS
// ========================================

function displayAttractions(attractions) {
    const container = document.getElementById('attractionCards');
    
    if (!container) {
        console.error('Attraction cards container not found');
        return;
    }
    
    if (!Array.isArray(attractions) || attractions.length === 0) {
        container.innerHTML = '<p class="loading" style="grid-column: 1/-1; text-align: center;">No attractions found.</p>';
        return;
    }
    
    let cardsHTML = '';
    
    attractions.forEach((attraction, index) => {
        cardsHTML += `
            <article class="attraction-card" data-index="${index}">
                <div class="card-image">
                    <img src="${attraction.image || 'images/placeholder.webp'}" 
                         alt="${attraction.title || 'Attraction'}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'">
                </div>
                <div class="card-content">
                    <h2 class="card-title">${attraction.title || 'Untitled Attraction'}</h2>
                    <p class="card-address"><svg class="location-icon" width="16" height="16" viewBox="0 0 512 512" fill="currentColor"><path d="M256 0C167.641 0 96 71.625 96 160c0 24.75 5.625 48.219 15.672 69.125C112.234 230.313 256 512 256 512s143.766-281.688 144.328-282.875C410.375 208.219 416 184.75 416 160 416 71.625 344.375 0 256 0zm0 256c-53.016 0-96-42.984-96-96s42.984-96 96-96 96 42.984 96 96-42.984 96-96 96z"/></svg> ${attraction.address || 'Address not available'}</p>
                    <p class="card-description">${attraction.description || 'No description available.'}</p>
                    ${attraction.website && attraction.website !== '#' ? `
                    <a href="${attraction.website}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="card-button">
                        Learn More →
                    </a>
                    ` : '<span class="card-button disabled" style="opacity: 0.5; cursor: not-allowed;">No Website Available</span>'}
                </div>
            </article>
        `;
    });
    
    container.innerHTML = cardsHTML;
}


// ========================================
// VIEW TOGGLE FUNCTIONALITY
// ========================================

function setupViewToggle() {
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const container = document.getElementById('attractionCards');
    
    if (!gridViewBtn || !listViewBtn || !container) {
        console.warn('View toggle buttons not found');
        return;
    }
    
    // Grid View
    gridViewBtn.addEventListener('click', () => {
        container.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        
        // Save preference
        try {
            localStorage.setItem('viewPreference', 'grid');
        } catch (error) {
            console.warn('Could not save view preference:', error);
        }
    });
    
    // List View
    listViewBtn.addEventListener('click', () => {
        container.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        
        // Save preference
        try {
            localStorage.setItem('viewPreference', 'list');
        } catch (error) {
            console.warn('Could not save view preference:', error);
        }
    });
    
    // Load saved preference
    try {
        const savedView = localStorage.getItem('viewPreference');
        if (savedView === 'list') {
            listViewBtn.click();
        }
    } catch (error) {
        console.warn('Could not load view preference:', error);
    }
}


// ========================================
// LAZY LOADING FOR IMAGES (Optional Enhancement)
// ========================================

function setupLazyLoading() {
    // Browser native lazy loading is sufficient
    // This function is kept for potential future enhancements
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.style.opacity = '1'; // Ensure images are visible
    });
}


// ========================================
// END OF DISCOVER.JS
// ========================================