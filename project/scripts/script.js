// API Configuration
const WEATHER_API_KEY = '4b6617030376791602a616bc73c4e742';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Global variables
let coffeeProducts = [];
let farmers = [];

// Modal Functions
function openProductModal(productId) {
    const product = coffeeProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${product.name}</h2>
            <div class="modal-price">$${product.price}</div>
        </div>
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 1.5rem; object-fit: contain; background-color: #f5f5f5;">
        <div class="modal-body">
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Origin:</strong> ${product.origin}</p>
            <p><strong>Roast Level:</strong> ${product.roast}</p>
            <p><strong>Flavor Notes:</strong> ${product.notes}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating} (${product.reviews} reviews)</p>
        </div>
        <div class="modal-footer">
            <button class="btn" id="addToCartBtn">Add to Cart</button>
            <button class="btn" id="closeModalBtn" style="background-color: #999;">Close</button>
        </div>
    `;
    
    document.getElementById('productModal').classList.add('active');
    
    // Add event listeners to dynamically created buttons
    document.getElementById('addToCartBtn').addEventListener('click', function() {
        addToCart(product.id);
        closeModal('productModal');
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        closeModal('productModal');
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
});

// Close modal button
document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal('productModal');
        });
    }
});

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when a link is clicked
if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Fetch Weather Data
async function fetchWeather() {
    try {
        const response = await fetch(
            `${WEATHER_API_URL}?lat=0.3163&lon=32.5832&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        const container = document.getElementById('weatherContainer');
        if (container) {
            container.innerHTML = '<div class="weather-loading">Unable to load weather data</div>';
        }
    }
}

// Display Weather Data
function displayWeather(data) {
    const container = document.getElementById('weatherContainer');
    if (!container) return;

    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                temp: Math.round(item.main.temp),
                condition: item.weather[0].main,
                humidity: item.main.humidity,
                rainfall: item.rain ? item.rain['3h'] : 0,
                description: item.weather[0].description
            };
        }
    });

    container.innerHTML = '';
    Object.entries(dailyForecasts).slice(0, 7).forEach(([day, weather]) => {
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h3>${day}</h3>
            <div class="weather-temp">${weather.temp}°C</div>
            <div class="weather-condition">${weather.condition}</div>
            <small>💧 ${weather.humidity}% | 🌧️ ${weather.rainfall}mm</small>
        `;
        container.appendChild(card);
    });
}

// Display Products
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    container.innerHTML = coffeeProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-rating">⭐ ${product.rating} (${product.reviews})</span>
                </div>
                <p style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">
                    <strong>From:</strong> ${product.origin} | <strong>Roast:</strong> ${product.roast}
                </p>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="product-btn view-details" data-id="${product.id}" style="flex: 1;">View Details</button>
                    <button class="product-btn add-cart" data-id="${product.id}" style="flex: 1;">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Event listeners for product buttons
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            openProductModal(parseInt(this.dataset.id));
        });
    });
    
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            addToCart(parseInt(this.dataset.id));
        });
    });
}

// Display Farmers
function displayFarmers() {
    const container = document.getElementById('farmersContainer');
    if (!container) return;

    container.innerHTML = farmers.map(farmer => `
        <div class="farmer-card">
            <img src="${farmer.image}" alt="${farmer.name}" class="farmer-image">
            <div class="farmer-info">
                <h3 class="farmer-name">${farmer.name}</h3>
                <p class="farmer-location">📍 ${farmer.location}</p>
                <p class="farmer-bio">${farmer.bio}</p>
                <p><strong>Farm Size:</strong> ${farmer.farmSize}</p>
                <p><strong>Specialties:</strong> ${farmer.crops.join(', ')}</p>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = coffeeProducts.find(p => p.id === productId);
    alert(`${product.name} added to cart!`);
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Update year and last modified date in footer
function updateFooter() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastModifiedElement.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Fetch coffee data from JSON
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            coffeeProducts = data.products;
            displayProducts();
        })
        .catch(error => console.error('Error loading coffee data:', error));
    
    updateFooter();
    fetchWeather();
    displayFarmers();
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});