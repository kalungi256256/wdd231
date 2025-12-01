// scripts/utils.js

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {*} data - The data to store (will be JSON stringified)
 */
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {*} The parsed data or null if not found
 */
export function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 */
export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Display a message to the user
 * @param {HTMLElement} container - The element to insert the message before
 * @param {string} message - The message text
 * @param {string} type - 'success' or 'error'
 */
export function showMessage(container, message, type = 'success') {
    // Remove any existing messages
    const existingMessage = container.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert at the beginning of the form
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(d);
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user object or null
 */
export function getCurrentUser() {
    return getFromLocalStorage('currentUser');
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isUserLoggedIn() {
    const user = getCurrentUser();
    return user && user.isLoggedIn === true;
}

/**
 * Logout user
 */
export function logoutUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        currentUser.isLoggedIn = false;
        
        // Update in users list
        const users = getFromLocalStorage('users') || [];
        const updatedUsers = users.map(u => 
            u.email === currentUser.email ? currentUser : u
        );
        saveToLocalStorage('users', updatedUsers);
    }
    
    // Remove current user session
    removeFromLocalStorage('currentUser');
    
    // Redirect to home
    window.location.href = 'index.html';
}