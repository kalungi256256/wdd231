// API Configuration
const WEATHER_API_KEY = '4b6617030376791602a616bc73c4e742';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Coffee Products Data
const coffeeProducts = [
    {
        id: 1,
        name: 'Ugandan Arabica Premium',
        category: 'Arabica',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=250&fit=crop',
        description: 'High altitude grown Arabica beans with smooth, balanced flavor profile',
        rating: 4.8,
        reviews: 45,
        origin: 'Bugisu, Uganda',
        roast: 'Medium',
        notes: 'Chocolate, Citrus, Nuts'
    },
    {
        id: 2,
        name: 'Robusta Bold Blend',
        category: 'Robusta',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688bcf4b7?w=400&h=250&fit=crop',
        description: 'Full-bodied Robusta with rich, earthy undertones perfect for espresso',
        rating: 4.6,
        reviews: 32,
        origin: 'Kampala Region, Uganda',
        roast: 'Dark',
        notes: 'Earth, Cocoa, Spice'
    },
    {
        id: 3,
        name: 'Elgon Mountain Select',
        category: 'Arabica',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=250&fit=crop',
        description: 'Rare mountain-grown Arabica with complex flavor complexity',
        rating: 4.9,
        reviews: 28,
        origin: 'Mount Elgon, Uganda',
        roast: 'Medium',
        notes: 'Berry, Floral, Caramel'
    },
    {
        id: 4,
        name: 'Rwenzori Reserve',
        category: 'Arabica',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1600788148184-7109a588a20e?w=400&h=250&fit=crop',
        description: 'Limited edition from Rwenzori Mountains with exceptional quality',
        rating: 5.0,
        reviews: 18,
        origin: 'Rwenzori Mountains, Uganda',
        roast: 'Light',
        notes: 'Jasmine, Honey, Peach'
    },
    {
        id: 5,
        name: 'Mbarara Microlot',
        category: 'Robusta',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1510373349887-d6b7e7ddc29f?w=400&h=250&fit=crop',
        description: 'Small batch Robusta with carefully controlled fermentation',
        rating: 4.7,
        reviews: 24,
        origin: 'Mbarara, Uganda',
        roast: 'Medium-Dark',
        notes: 'Tobacco, Walnut, Dark Chocolate'
    },
    {
        id: 6,
        name: 'Fort Portal Sunrise',
        category: 'Arabica',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=400&h=250&fit=crop',
        description: 'Balanced blend with bright acidity and smooth finish',
        rating: 4.7,
        reviews: 35,
        origin: 'Fort Portal, Uganda',
        roast: 'Light-Medium',
        notes: 'Apple, Caramel, Almond'
    }
];

// Farmers Data
const farmers = [
    {
        id: 1,
        name: 'David Kasoro',
        location: 'Bugisu, Uganda',
        image: 'https://i.pinimg.com/1200x/68/30/56/68305605854c9381bd650fa0e78fc663.jpg',
        bio: 'Growing premium Arabica for over 15 years. Passionate about sustainable farming and fair trade.',
        crops: ['Arabica', 'Organic Certified'],
        farmSize: '5 hectares'
    },
    {
        id: 2,
        name: 'Maria Nakato',
        location: 'Kampala Region, Uganda',
        image: 'https://i.pinimg.com/736x/74/5d/f5/745df59120bb7247ae8b228d7a1fe249.jpg',
        bio: 'Women-led cooperative focusing on quality Robusta and environmental conservation.',
        crops: ['Robusta', 'Fair Trade'],
        farmSize: '8 hectares'
    },
    {
        id: 3,
        name: 'John Kipkemboi',
        location: 'Mount Elgon, Uganda',
        image: 'https://i.pinimg.com/1200x/a9/39/57/a93957d6b256a2e01c00c8ebd2d96dad.jpg',
        bio: 'Third generation coffee farmer producing mountain-grown specialty Arabica.',
        crops: ['Arabica', 'High Altitude'],
        farmSize: '3 hectares'
    },
    {
        id: 4,
        name: 'Grace Namugambe',
        location: 'Mbarara, Uganda',
        image: 'https://i.pinimg.com/736x/6f/a3/9d/6fa39d8261840c0f3c3c369452c1cf78.jpg',
        bio: 'Community leader promoting cooperative farming and youth training in coffee production.',
        crops: ['Robusta', 'Training Hub'],
        farmSize: '12 hectares'
    },
    {
        id: 5,
        name: 'Charles Tumusiime',
        location: 'Fort Portal, Uganda',
        image: 'https://i.pinimg.com/1200x/2b/0a/f9/2b0af926279fbadb00334ec9f284278b.jpg',
        bio: 'Innovative farmer using sustainable water management and composting techniques.',
        crops: ['Arabica', 'Sustainable'],
        farmSize: '6 hectares'
    },
    {
        id: 6,
        name: 'Harriet Achieng',
        location: 'Rwenzori Mountains, Uganda',
        image: 'https://i.pinimg.com/736x/46/2a/07/462a071d3f3e2f46760bdbdd6059cc53.jpg',
        bio: 'Produces rare, limited-edition Arabica using traditional organic methods.',
        crops: ['Arabica', 'Organic', 'Limited Edition'],
        farmSize: '4 hectares'
    }
];

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
            <button class="btn" onclick="addToCart(${product.id}); closeModal('productModal')">Add to Cart</button>
            <button class="btn" style="background-color: #999;" onclick="closeModal('productModal')">Close</button>
        </div>
    `;
    
    document.getElementById('productModal').classList.add('active');
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
                    <button class="product-btn" onclick="openProductModal(${product.id})" style="flex: 1;">View Details</button>
                    <button class="product-btn" onclick="addToCart(${product.id})" style="flex: 1;">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const params = new URLSearchParams(formData);
    
    localStorage.setItem('lastFormSubmission', JSON.stringify(Object.fromEntries(formData)));
    window.location.href = `form-result.html?${params.toString()}`;
}

// Update year and last modified date in footer
function updateFooter() {
    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Set last modified date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastModifiedElement.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateFooter();
    fetchWeather();
    displayProducts();
    displayFarmers();
    
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});