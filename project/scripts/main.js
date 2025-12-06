// scripts/main.js - Complete updated version
import { initWeather } from './weather.js';

console.log('main.js loaded - Pearl Beans Coffee');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded and parsed');
    
    // Initialize basic functionality
    initializeNavigation();
    initializeFooter();
    initializeContactForms();
    initializeModal();
    
    // Check current page and initialize page-specific features
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    
    // Initialize based on page
    switch (currentPage) {
        case 'index':
            console.log('Initializing home page features');
            await initializeHomePage();
            break;
        case 'products':
            console.log('Products page detected - products.js will handle this');
            // Products.js should handle product loading
            break;
        case 'farmers':
            console.log('Farmers page detected - farmers.js will handle this');
            // Farmers.js should handle farmer loading
            break;
        case 'form-action':
            console.log('Form action page');
            displayFormData();
            break;
        case 'attributions':
            console.log('Attributions page');
            break;
        default:
            console.log('Unknown page, defaulting to home features');
            await initializeHomePage();
    }
    
    // Initialize cart
    initializeCart();
    
    // Add debug info
    addDebugInfo();
});

// ========== UTILITY FUNCTIONS ==========

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page.includes('github.io')) {
        return 'index';
    } else if (page === 'products.html') {
        return 'products';
    } else if (page === 'farmers.html') {
        return 'farmers';
    } else if (page === 'form-action.html') {
        return 'form-action';
    } else if (page === 'attributions.html') {
        return 'attributions';
    }
    return 'index';
}

// ========== NAVIGATION ==========

function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        console.log('Hamburger clicked');
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Highlight active page in navigation
    highlightActivePage();
}

function highlightActivePage() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPage === 'index' && href === 'index.html') ||
            (currentPage === 'products' && href === 'products.html') ||
            (currentPage === 'farmers' && href === 'farmers.html')) {
            link.classList.add('active');
        }
    });
}

// ========== HOME PAGE INITIALIZATION ==========

async function initializeHomePage() {
    console.log('Initializing home page...');
    
    // Initialize weather
    await initializeWeather();
    
    // Load featured products
    await loadFeaturedProducts();
    
    // Set up any home page specific event listeners
    setupHomePageListeners();
}

async function initializeWeather() {
    console.log('Initializing weather display...');
    const weatherElement = document.getElementById('weather-display');
    
    if (!weatherElement) {
        console.warn('Weather display element not found');
        return;
    }
    
    // Show loading state
    weatherElement.innerHTML = `
        <h2>Current Weather in Mukono</h2>
        <div class="weather-info">
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading Mukono weather data...</p>
                <p><small>Coordinates: 0.3533°N, 32.7553°E</small></p>
            </div>
        </div>
    `;
    
    // Add spinner styles if not present
    addSpinnerStyles();
    
    try {
        // Call the weather module
        if (typeof initWeather === 'function') {
            await initWeather();
        } else {
            throw new Error('Weather module not loaded');
        }
    } catch (error) {
        console.error('Failed to initialize weather:', error);
        displayWeatherError(error);
    }
}

function addSpinnerStyles() {
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .loading {
                text-align: center;
                padding: 2rem;
            }
            
            .spinner {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 3px solid rgba(10, 22, 40, 0.1);
                border-radius: 50%;
                border-top-color: var(--primary-color);
                animation: spin 1s ease-in-out infinite;
                margin-bottom: 1rem;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function displayWeatherError(error) {
    const weatherElement = document.getElementById('weather-display');
    if (!weatherElement) return;
    
    weatherElement.innerHTML = `
        <h2>Weather in Mukono, Uganda</h2>
        <div class="weather-content error">
            <div class="weather-main">
                <div class="weather-icon">⚠️</div>
                <div class="weather-temp">--°C</div>
            </div>
            <div class="weather-details">
                <h3>Weather Data Unavailable</h3>
                <p class="weather-condition">Using static climate information</p>
                <div class="weather-stats">
                    <div class="weather-stat">
                        <span class="stat-label">Average Temperature:</span>
                        <span class="stat-value">22-27°C</span>
                    </div>
                    <div class="weather-stat">
                        <span class="stat-label">Altitude:</span>
                        <span class="stat-value">1200m</span>
                    </div>
                    <div class="weather-stat">
                        <span class="stat-label">Coordinates:</span>
                        <span class="stat-value">0.3533°N, 32.7553°E</span>
                    </div>
                    <div class="weather-stat">
                        <span class="stat-label">Climate:</span>
                        <span class="stat-value">Tropical Savanna</span>
                    </div>
                </div>
                <p class="weather-note">
                    <small>📍 Mukono District, Central Uganda<br>
                    Ideal coffee-growing region with fertile volcanic soil</small>
                </p>
                <button onclick="window.location.reload()" class="btn btn-secondary" style="margin-top: 1rem;">
                    Retry Weather
                </button>
            </div>
        </div>
    `;
}

async function loadFeaturedProducts() {
    console.log('Loading featured products...');
    const container = document.getElementById('featured-products');
    
    if (!container) {
        console.log('Featured products container not found');
        return;
    }
    
    // Show loading state
    container.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Loading featured coffees...</p>
        </div>
    `;
    
    try {
        // Try to load from JSON
        const response = await fetch('./data/coffee-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Featured products data loaded:', data.products.length, 'products found');
        
        if (data.products && data.products.length > 0) {
            // Get first 3 products for featured section
            const featuredProducts = data.products.slice(0, 3);
            displayFeaturedProducts(featuredProducts, container);
        } else {
            throw new Error('No products found in data');
        }
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        displayFeaturedProductsError(container, error);
    }
}

function displayFeaturedProducts(products, container) {
    console.log('Displaying', products.length, 'featured products');
    
    // Clear container
    container.innerHTML = '';
    
    // Array method: forEach to display each product
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });
    
    // Add event listeners to the new buttons
    addProductCardListeners(container);
}

function createProductCard(product) {
    // Template literal for product card
    return `
        <div class="product-card" data-id="${product.id}" data-type="${product.type}">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 loading="lazy" 
                 width="400" 
                 height="300"
                 onerror="this.src='https://images.unsplash.com/photo-1587734195507-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-type"><strong>Type:</strong> ${product.type}</p>
                <p class="product-region"><strong>Region:</strong> ${product.region}</p>
                <p class="product-altitude"><strong>Altitude:</strong> ${product.altitude}m</p>
                <p class="product-flavor"><strong>Flavor Notes:</strong> ${product.flavorNotes}</p>
                <p class="product-price">$${product.price}/kg</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline view-details" data-product-id="${product.id}">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayFeaturedProductsError(container, error) {
    container.innerHTML = `
        <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <h3>Unable to Load Products</h3>
            <p>${error.message}</p>
            <div class="fallback-products">
                <p>Here are some of our popular coffees:</p>
                <div class="product-card">
                    <div class="product-info">
                        <h3>Ugandan Arabica Blend</h3>
                        <p class="product-price">$28.50/kg</p>
                        <p>Rich and balanced with chocolate notes</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupHomePageListeners() {
    // Any home page specific event listeners
    const heroButton = document.querySelector('.hero .btn-primary');
    if (heroButton) {
        heroButton.addEventListener('click', () => {
            console.log('Hero button clicked');
            // Track this event if needed
        });
    }
}

// ========== CART FUNCTIONALITY ==========

function initializeCart() {
    console.log('Initializing cart...');
    
    // Update cart count on all pages
    updateCartCount();
    
    // Set up cart button if it exists
    const viewCartBtn = document.getElementById('view-cart');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', showCartModal);
    }
    
    // Add event delegation for add-to-cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.matches('.add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = button.dataset.productId;
            if (productId) {
                addToCart(productId);
                updateCartCount();
                showAddToCartNotification(productId);
            }
        }
    });
}

function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: productId, 
            quantity: 1,
            added: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated:', cart);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    document.querySelectorAll('#cart-count').forEach(element => {
        element.textContent = cartCount;
    });
    
    // Update cart button text if it exists
    const viewCartBtn = document.getElementById('view-cart');
    if (viewCartBtn) {
        viewCartBtn.textContent = `View Cart (${cartCount})`;
    }
}

function showAddToCartNotification(productId) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>✅ Product added to cart!</span>
        </div>
    `;
    
    // Add styles if not present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                animation-fill-mode: forwards;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

async function showCartModal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    try {
        // Load product data to get details
        const response = await fetch('./data/coffee-data.json');
        const data = await response.json();
        const products = data.products || [];
        
        let modalHTML = `
            <div class="modal" id="cart-modal" aria-hidden="false">
                <div class="modal-content" style="max-width: 500px;">
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                    <div class="modal-body">
                        <h2>Your Shopping Cart</h2>
        `;
        
        let total = 0;
        
        cart.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                total += itemTotal;
                
                modalHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <p>Quantity: ${cartItem.quantity}</p>
                            <p>Price: $${product.price}/kg</p>
                        </div>
                        <div class="cart-item-total">
                            $${itemTotal.toFixed(2)}
                        </div>
                    </div>
                `;
            }
        });
        
        modalHTML += `
                        <div class="cart-total">
                            <strong>Total: $${total.toFixed(2)}</strong>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-secondary" id="close-cart">Continue Shopping</button>
                            <button class="btn btn-primary" id="checkout-cart">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('cart-modal');
        if (existingModal) existingModal.remove();
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        const modal = document.getElementById('cart-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const closeCartBtn = modal.querySelector('#close-cart');
        const checkoutBtn = modal.querySelector('#checkout-cart');
        
        closeBtn.addEventListener('click', () => modal.remove());
        closeCartBtn.addEventListener('click', () => modal.remove());
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality would be implemented here!');
            modal.remove();
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error loading cart:', error);
        alert('Unable to load cart. Please try again.');
    }
}

// ========== MODAL FUNCTIONALITY ==========

function initializeModal() {
    console.log('Initializing modal...');
    
    // Event delegation for view-details buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.view-details') || e.target.closest('.view-details')) {
            const button = e.target.matches('.view-details') ? e.target : e.target.closest('.view-details');
            const productId = button.dataset.productId;
            if (productId) {
                showProductModal(productId);
            }
        }
    });
}

async function showProductModal(productId) {
    console.log('Showing product modal for:', productId);
    
    try {
        const response = await fetch('./data/coffee-data.json');
        const data = await response.json();
        const product = data.products.find(p => p.id == productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        const modalHTML = `
            <div class="modal" id="product-modal" aria-hidden="false">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                    <div class="modal-body">
                        <h2>${product.name}</h2>
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                        <div class="product-details">
                            <p><strong>Type:</strong> ${product.type}</p>
                            <p><strong>Region:</strong> ${product.region}</p>
                            <p><strong>Altitude:</strong> ${product.altitude}m</p>
                            <p><strong>Process:</strong> ${product.process}</p>
                            <p><strong>Flavor Notes:</strong> ${product.flavorNotes}</p>
                            <p><strong>Price:</strong> $${product.price}/kg</p>
                            ${product.description ? `<p><strong>Description:</strong> ${product.description}</p>` : ''}
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary add-to-cart-modal" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                            <button class="btn btn-outline close-modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('product-modal');
        if (existingModal) existingModal.remove();
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        const modal = document.getElementById('product-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const closeModalBtn = modal.querySelector('.close-modal');
        const addToCartBtn = modal.querySelector('.add-to-cart-modal');
        
        closeBtn.addEventListener('click', () => modal.remove());
        closeModalBtn.addEventListener('click', () => modal.remove());
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
            updateCartCount();
            showAddToCartNotification(product.id);
            modal.remove();
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error showing product modal:', error);
        alert('Unable to load product details. Please try again.');
    }
}

// ========== FORM FUNCTIONALITY ==========

function initializeContactForms() {
    console.log('Initializing contact forms...');
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation if needed
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Store in localStorage
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    console.log('Form data stored:', data);
    
    // Show success message
    showFormSuccessMessage(form);
    
    // Submit the form (will redirect to form-action.html)
    setTimeout(() => {
        form.submit();
    }, 1500);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = 'var(--error)';
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = 'var(--error)';
            return false;
        }
    }
    
    field.style.borderColor = '';
    return true;
}

function showFormSuccessMessage(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';
    
    setTimeout(() => {
        submitBtn.textContent = 'Sent! ✓';
        submitBtn.style.backgroundColor = 'var(--success)';
    }, 500);
}

function displayFormData() {
    const container = document.getElementById('submission-details');
    if (!container) return;
    
    const params = new URLSearchParams(window.location.search);
    
    if (params.toString()) {
        let html = '<h3>Your Inquiry Details:</h3><ul>';
        
        params.forEach((value, key) => {
            if (value && key !== 'submit') {
                const formattedKey = key.replace(/([A-Z])/g, ' $1')
                                       .replace(/^./, str => str.toUpperCase());
                html += `<li><strong>${formattedKey}:</strong> ${decodeURIComponent(value)}</li>`;
            }
        });
        
        html += '</ul>';
        container.innerHTML = html;
    }
}

// ========== FOOTER ==========

function initializeFooter() {
    console.log('Initializing footer...');
    
    // Set current year
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Update video link placeholder
    const videoLinks = document.querySelectorAll('.video-link');
    videoLinks.forEach(link => {
        if (link.href.includes('YOUR_ACTUAL_VIDEO_ID')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Please replace the video link with your actual project video URL.');
            });
        }
    });
}

// ========== EVENT LISTENERS FOR DYNAMIC CONTENT ==========

function addProductCardListeners(container) {
    // Add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            addToCart(productId);
            updateCartCount();
            showAddToCartNotification(productId);
        });
    });
    
    // View details buttons
    container.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            showProductModal(productId);
        });
    });
}

// ========== DEBUGGING ==========

function addDebugInfo() {
    // Only show in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('=== DEBUG INFO ===');
        console.log('LocalStorage items:', Object.keys(localStorage).length);
        console.log('Cart items:', JSON.parse(localStorage.getItem('cart') || '[]').length);
        console.log('Form submissions:', JSON.parse(localStorage.getItem('formSubmissions') || '[]').length);
        console.log('Weather cache:', localStorage.getItem('mukonoWeather') ? 'Exists' : 'None');
        console.log('==================');
    }
}

// ========== GLOBAL FUNCTIONS ==========

// Make important functions available globally if needed
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.showProductModal = showProductModal;

// ========== ERROR HANDLING ==========

window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ========== INITIALIZATION COMPLETE ==========

console.log('main.js initialization complete');