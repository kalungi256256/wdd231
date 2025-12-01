// Main JavaScript file for Pearl Beans Coffee

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Update cart count
    updateCartCount();
    
    // Check login status
    checkLoginStatus();
    
    // Initialize modals
    initModals();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !hamburger.contains(event.target)) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Save to localStorage
            let subscribers = JSON.parse(localStorage.getItem('pbNewsletterSubscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('pbNewsletterSubscribers', JSON.stringify(subscribers));
            }
            
            // Show success message
            const modal = document.getElementById('newsletterModal');
            if (modal) {
                modal.style.display = 'flex';
            }
            
            // Reset form
            this.reset();
        });
    }
}

// Cart Functionality
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('pbCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Login Status Check
function checkLoginStatus() {
    const accountLink = document.getElementById('accountLink');
    const loggedIn = localStorage.getItem('pbLoggedIn');
    const expires = localStorage.getItem('pbLoginExpires');
    
    if (accountLink && loggedIn === 'true') {
        // Check if login has expired
        if (expires && new Date(expires) > new Date()) {
            accountLink.style.display = 'block';
        } else {
            // Login expired
            localStorage.removeItem('pbLoggedIn');
            localStorage.removeItem('pbLoginExpires');
            accountLink.style.display = 'none';
        }
    }
}

// Modal Functionality
function initModals() {
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

// Export functions for use in other modules
export { initMobileMenu, updateCartCount, checkLoginStatus };