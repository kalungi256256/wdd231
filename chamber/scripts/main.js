// ========================================
// MUKONO CHAMBER OF COMMERCE - MAIN JS
// ========================================

// ========================================
// 1. NAVIGATION TOGGLE (Hamburger Menu)
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

if (hamburger && navMenu) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a navigation link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}


// ========================================
// 2. WEATHER API CONFIGURATION
// ========================================

const WEATHER_CONFIG = {
    apiKey: '9ba6ea9ffb6c3c19c77e3d70a223c4d8', // Replace with your API key from openweathermap.org
    city: 'Mukono',
    country: 'UG',
    units: 'metric', // metric for Celsius, imperial for Fahrenheit
    lat: 0.3531,     // Mukono coordinates
    lon: 32.7554
};


// ========================================
// 3. FETCH CURRENT WEATHER
// ========================================

async function fetchCurrentWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.country}&appid=${WEATHER_CONFIG.apiKey}&units=${WEATHER_CONFIG.units}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        document.getElementById('current-weather').innerHTML = 
            '<p style="color: #e76f51; text-align: center;">Unable to load weather data. Please try again later.</p>';
    }
}


// ========================================
// 4. DISPLAY CURRENT WEATHER
// ========================================

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('current-weather');
    
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const cityName = data.name;
    
    weatherDiv.innerHTML = `
        <div class="weather-current">
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                 alt="${description}">
            <div class="weather-info">
                <h3>${temp}°C</h3>
                <p style="text-transform: capitalize; font-weight: 600; color: #264653;">${description}</p>
                <p><strong>Feels like:</strong> ${feelsLike}°C</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind:</strong> ${windSpeed} m/s</p>
            </div>
        </div>
    `;
}


// ========================================
// 5. FETCH 3-DAY WEATHER FORECAST
// ========================================

async function fetchWeatherForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.country}&appid=${WEATHER_CONFIG.apiKey}&units=${WEATHER_CONFIG.units}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Forecast API error: ${response.status}`);
        }
        
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        document.getElementById('forecast-weather').innerHTML = 
            '<p style="color: #e76f51; text-align: center;">Unable to load forecast data. Please try again later.</p>';
    }
}


// ========================================
// 6. DISPLAY WEATHER FORECAST
// ========================================

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast-weather');
    
    // Get forecasts for next 3 days at noon (12:00:00)
    const middayForecasts = data.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 3);
    
    let forecastHTML = '<div class="forecast-container">';
    
    middayForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;
        
        forecastHTML += `
            <div class="forecast-day">
                <h4>${dayName}</h4>
                <p style="font-size: 0.85rem; color: #666;">${monthDay}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" 
                     alt="${description}">
                <p style="font-size: 1.3rem; font-weight: bold; color: #264653;">${temp}°C</p>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    });
    
    forecastHTML += '</div>';
    forecastDiv.innerHTML = forecastHTML;
}


// ========================================
// 7. FETCH COMPANY SPOTLIGHT DATA
// ========================================

async function fetchCompanySpotlight() {
    try {
        const response = await fetch('data/members.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const companies = await response.json();
        displayCompanySpotlight(companies);
    } catch (error) {
        console.error('Error fetching company data:', error);
        document.getElementById('spotlight-container').innerHTML = 
            '<p style="color: #e76f51; text-align: center;">Unable to load member spotlight. Please ensure data/members.json exists.</p>';
    }
}


// ========================================
// 8. DISPLAY COMPANY SPOTLIGHT
// ========================================

function displayCompanySpotlight(companies) {
    const spotlightDiv = document.getElementById('spotlight-container');
    
    // Filter for Gold and Silver members only
    const qualifiedMembers = companies.filter(company => 
        company.membershipLevel === 'Gold' || company.membershipLevel === 'Silver'
    );
    
    if (qualifiedMembers.length === 0) {
        spotlightDiv.innerHTML = '<p style="text-align: center;">No qualified members available for spotlight.</p>';
        return;
    }
    
    // Randomly select 2-3 companies
    const numToDisplay = Math.min(3, qualifiedMembers.length);
    const selectedCompanies = getRandomCompanies(qualifiedMembers, numToDisplay);
    
    let spotlightHTML = '';
    
    selectedCompanies.forEach(company => {
        spotlightHTML += `
            <div class="spotlight-card">
                <img src="${company.image}" 
                     alt="${company.name}"
                     onerror="this.src='images/placeholder.jpg'">
                <h3>${company.name}</h3>
                ${company.tagline ? `<p class="company-tagline">"${company.tagline}"</p>` : ''}
                <p><strong>📞</strong> ${company.phone}</p>
                <p><strong>📍</strong> ${company.address}</p>
                <span class="membership-badge ${company.membershipLevel.toLowerCase()}">
                    ${company.membershipLevel} Member
                </span>
                <br>
                <a href="${company.website}" target="_blank" class="company-website">
                    Visit Website →
                </a>
            </div>
        `;
    });
    
    spotlightDiv.innerHTML = spotlightHTML;
}


// ========================================
// 9. HELPER: GET RANDOM COMPANIES
// ========================================

function getRandomCompanies(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


// ========================================
// 10. FOOTER: CURRENT YEAR & LAST MODIFIED
// ========================================

function updateFooter() {
    // Set current year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Set last modified date
    const modifiedSpan = document.getElementById('lastModified');
    if (modifiedSpan) {
        modifiedSpan.textContent = document.lastModified;
    }
}


// ========================================
// 11. INITIALIZE ALL FUNCTIONS ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mukono Chamber website loaded successfully!');
    
    // Initialize footer
    updateFooter();
    
    // Initialize weather
    fetchCurrentWeather();
    fetchWeatherForecast();
    
    // Initialize company spotlight
    fetchCompanySpotlight();
    
    // Refresh weather every 30 minutes (1800000 milliseconds)
    setInterval(() => {
        fetchCurrentWeather();
        fetchWeatherForecast();
    }, 1800000);
});


// ========================================
// 12. ERROR HANDLING FOR IMAGES
// ========================================

// Add default error handler for all images on page load
window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('onerror')) {
            img.onerror = function() {
                this.style.display = 'none';
                console.warn('Image failed to load:', this.src);
            };
        }
    });
});


// ========================================
// END OF MAIN.JS
// ========================================