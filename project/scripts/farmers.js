// scripts/farmers.js - Updated with better error handling
console.log('farmers.js loaded');

export async function loadFarmers() {
    try {
        console.log('Loading farmers data...');
        const response = await fetch('./data/coffee-data.json');
        console.log('Farmers fetch response:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to load farmer data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Farmers data loaded:', data);
        console.log('Number of farmers:', data.farmers ? data.farmers.length : 0);
        
        if (!data.farmers || data.farmers.length === 0) {
            throw new Error('No farmers found in data');
        }
        
        displayFarmers(data.farmers);
        
    } catch (error) {
        console.error('Error loading farmers:', error);
        const container = document.getElementById('farmers-grid');
        if (container) {
            container.innerHTML = `
                <div class="error" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <h3>Error Loading Farmers</h3>
                    <p>${error.message}</p>
                    <p>Check the coffee-data.json file for a "farmers" array.</p>
                </div>
            `;
        }
    }
}

function displayFarmers(farmers) {
    const container = document.getElementById('farmers-grid');
    if (!container) {
        console.error('Container #farmers-grid not found');
        return;
    }
    
    console.log('Displaying', farmers.length, 'farmers');
    container.innerHTML = '';
    
    // Array method: map to create farmer cards
    const farmerCards = farmers.map(farmer => `
        <div class="farmer-card">
            <img src="${farmer.image || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                 alt="${farmer.name || 'Coffee farmer'}" 
                 loading="lazy" 
                 width="400" 
                 height="250"
                 onerror="this.src='https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            <div class="farmer-info">
                <h3>${farmer.name || 'Coffee Farmer'}</h3>
                <p><strong>Region:</strong> ${farmer.region || 'Uganda'}</p>
                <p><strong>Cooperative:</strong> ${farmer.cooperative || 'Local Cooperative'}</p>
                <p><strong>Years Farming:</strong> ${farmer.years || '10+'} years</p>
                <p><strong>Specialty:</strong> ${farmer.specialty || 'Arabica'}</p>
                <p><strong>Farm Size:</strong> ${farmer.farmSize || 'Small family farm'}</p>
                <p><strong>Sustainability:</strong> ${farmer.practices || 'Organic farming'}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = farmerCards;
}

// Initialize farmers page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM ready, checking for farmers grid');
        if (document.getElementById('farmers-grid')) {
            console.log('Farmers grid found, loading farmers');
            loadFarmers();
        }
    });
} else {
    console.log('DOM already loaded, checking for farmers grid');
    if (document.getElementById('farmers-grid')) {
        console.log('Farmers grid found, loading farmers');
        loadFarmers();
    }
}