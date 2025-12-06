// scripts/products.js - Updated with better error handling
console.log('products.js loaded');

// Load and display all products
export async function loadProducts() {
    try {
        console.log('loadProducts() called');
        const response = await fetch('./data/coffee-data.json');
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to load product data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products data loaded:', data);
        console.log('Number of products:', data.products ? data.products.length : 0);
        
        if (!data.products || data.products.length === 0) {
            throw new Error('No products found in data');
        }
        
        // Display all products (15+ required)
        displayAllProducts(data.products);
        
        // Setup filters
        setupFilters(data.products);
        
        // Setup cart view button
        setupCartView();
        
    } catch (error) {
        console.error('Error loading products:', error);
        const container = document.getElementById('all-products');
        if (container) {
            container.innerHTML = `
                <div class="error" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <h3>Error Loading Products</h3>
                    <p>${error.message}</p>
                    <p>Please check:</p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Is coffee-data.json in the /data folder?</li>
                        <li>Is the JSON valid? Check browser console.</li>
                        <li>Are you running on a local server? (not file://)</li>
                    </ul>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
}

function displayAllProducts(products) {
    const container = document.getElementById('all-products');
    if (!container) {
        console.error('Container #all-products not found');
        return;
    }
    
    console.log('Displaying all products in container:', container);
    container.innerHTML = '';
    
    // Array method: forEach to display each product
    products.forEach(product => {
        console.log('Processing product:', product.id, product.name);
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });
    
    // Show message if no products
    const noProducts = document.getElementById('no-products');
    if (products.length === 0) {
        console.log('No products to display');
        if (noProducts) noProducts.style.display = 'block';
    } else {
        console.log(`Displayed ${products.length} products`);
        if (noProducts) noProducts.style.display = 'none';
    }
}

function createProductCard(product) {
    // Use the function from main.js or define it here
    // For now, let's create a simple version
    return `
        <div class="product-card" data-id="${product.id}" data-type="${product.type}">
            <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="300">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-type"><strong>Type:</strong> ${product.type}</p>
                <p class="product-region"><strong>Region:</strong> ${product.region}</p>
                <p class="product-altitude"><strong>Altitude:</strong> ${product.altitude}m</p>
                <p class="product-process"><strong>Process:</strong> ${product.process}</p>
                <p class="product-flavor"><strong>Flavor Notes:</strong> ${product.flavorNotes}</p>
                <p class="product-price">$${product.price}/kg</p>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
                <button class="btn btn-outline view-details" data-product-id="${product.id}">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Setup filters function
function setupFilters(products) {
    const typeFilter = document.getElementById('coffee-type');
    const sortSelect = document.getElementById('sort-by');
    const resetBtn = document.getElementById('reset-filters');
    
    if (!typeFilter || !sortSelect || !resetBtn) {
        console.warn('Filter elements not found');
        return;
    }
    
    console.log('Setting up filters with', products.length, 'products');
    
    // Filter by type
    typeFilter.addEventListener('change', () => {
        console.log('Filter changed to:', typeFilter.value);
        filterAndSortProducts(products);
    });
    
    // Sort products
    sortSelect.addEventListener('change', () => {
        console.log('Sort changed to:', sortSelect.value);
        filterAndSortProducts(products);
    });
    
    // Reset filters
    resetBtn.addEventListener('click', () => {
        console.log('Resetting filters');
        typeFilter.value = 'all';
        sortSelect.value = 'price-asc';
        filterAndSortProducts(products);
    });
    
    // Initial display
    filterAndSortProducts(products);
}

function filterAndSortProducts(products) {
    const typeFilter = document.getElementById('coffee-type');
    const sortSelect = document.getElementById('sort-by');
    
    if (!typeFilter || !sortSelect) return;
    
    // Filter products
    let filteredProducts = [...products]; // Create a copy
    
    if (typeFilter.value !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.type.toLowerCase() === typeFilter.value.toLowerCase()
        );
    }
    
    // Sort products (Array method: sort)
    filteredProducts.sort((a, b) => {
        switch (sortSelect.value) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'region':
                return a.region.localeCompare(b.region);
            default:
                return 0;
        }
    });
    
    console.log('Filtered and sorted products:', filteredProducts.length);
    displayAllProducts(filteredProducts);
}

function setupCartView() {
    const viewCartBtn = document.getElementById('view-cart');
    if (!viewCartBtn) {
        console.warn('View cart button not found');
        return;
    }
    
    viewCartBtn.addEventListener('click', () => {
        console.log('View cart clicked');
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Create modal for cart view
        showCartModal(cart);
    });
}

async function showCartModal(cart) {
    // Modal implementation...
}

// Initialize products page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM ready, initializing products page');
        if (document.getElementById('all-products')) {
            loadProducts();
        }
    });
} else {
    console.log('DOM already loaded, initializing products page');
    if (document.getElementById('all-products')) {
        loadProducts();
    }
}