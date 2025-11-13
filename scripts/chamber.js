// scripts/chamber.js

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Set last modified date
    document.getElementById('last-modified').textContent = document.lastModified;

    // Initialize navigation
    initNavigation();

    // Load weather data
    loadWeatherData();

    // Load company spotlights
    loadCompanySpotlights();
});

// Navigation functionality
function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav')) {
                navMenu.classList.remove('show');
            }
        });
    }
}

// Weather API functionality
async function loadWeatherData() {
    // Replace with your actual API key and location
    const apiKey = 'your-api-key-here';
    const city = 'Mukono';
    const state = 'ID';
    const country = 'Uganda';

    try {
        // Get current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&appid=${apiKey}`;
        const currentResponse = await fetch(currentWeatherUrl);
        const currentData = await currentResponse.json();

        // Display current weather
        document.getElementById('current-temp').innerHTML = `${Math.round(currentData.main.temp)}°F`;
        document.getElementById('weather-desc').textContent = currentData.weather[0].description;

        // Get forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&units=imperial&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Display 3-day forecast
        displayForecast(forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback data in case API fails
        document.getElementById('current-temp').innerHTML = '45°F';
        document.getElementById('weather-desc').textContent = 'Partly cloudy';
        displayFallbackForecast();
    }
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    // Get unique days from the forecast data
    const days = [];
    const today = new Date();

    for (let i = 1; i <= 3; i++) {
        const forecastDay = new Date(today);
        forecastDay.setDate(today.getDate() + i);

        // Find forecast for noon of each day
        const noonForecast = forecastData.list.find(item => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate.getDate() === forecastDay.getDate() &&
                itemDate.getHours() >= 12 &&
                itemDate.getHours() <= 14;
        });

        if (noonForecast) {
            const dayName = forecastDay.toLocaleDateString('en-US', { weekday: 'long' });
            const temp = Math.round(noonForecast.main.temp);

            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <span>${dayName}</span>
                <span>${temp}°F</span>
            `;

            forecastContainer.appendChild(dayElement);
        }
    }
}

function displayFallbackForecast() {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    const days = ['Tomorrow', 'Day After', 'Next Day'];
    const temps = [48, 52, 47];

    days.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <span>${day}</span>
            <span>${temps[index]}°F</span>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

// Company Spotlights functionality
async function loadCompanySpotlights() {
    try {
        // Fetch member data
        const response = await fetch('data/members.json');
        const members = await response.json();

        // Filter for gold and silver members
        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
        );

        // Randomly select 2-3 members
        const numToShow = Math.min(Math.floor(Math.random() * 2) + 2, eligibleMembers.length);
        const shuffled = [...eligibleMembers].sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, numToShow);

        // Display selected members
        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error('Error loading company spotlights:', error);
        // Fallback data in case JSON fails
        displayFallbackSpotlights();
    }
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo" class="spotlight-logo">
            <h3>${member.name}</h3>
            <span class="spotlight-level ${member.membershipLevel.toLowerCase()}">${member.membershipLevel} Member</span>
            <p>${member.description}</p>
            <div class="spotlight-contact">
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
            </div>
        `;

        container.appendChild(card);
    });
}

function displayFallbackSpotlights() {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    const fallbackMembers = [{
            name: ' Marvin Solutions',
            image: 'tech-company.jpg',
            membershipLevel: 'Gold',
            description: 'Providing innovative technology solutions for local businesses.',
            phone: '(+256) 123-4567',
            address: 'Nasuti Road, Mukono, Uganda',
            website: 'https://example.com'
        },
        {
            name: 'Centinary Bank',
            image: 'bank-logo.jpg',
            membershipLevel: 'Silver',
            description: 'Your trusted financial partner for personal and business banking.',
            phone: '(+256) 987-6543',
            address: ' Finance Kayunga Rd, Mukono,Uganda',
            website: 'https://example.com'
        }
    ];

    displaySpotlights(fallbackMembers);
}