// scripts/weather.js - Updated with 7-day forecast for Mukono
console.log('weather.js loaded');

// Mukono, Uganda coordinates
const MUKONO_LAT = 0.3533;
const MUKONO_LON = 32.7553;

export async function initWeather() {
    try {
        console.log('Initializing 7-day weather forecast for Mukono...');
        const apiKey = '4b6617030376791602a616bc73c4e742';
        
        // Clear previous content
        const weatherElement = document.getElementById('weather-display');
        if (weatherElement) {
            weatherElement.innerHTML = '<div class="loading">Loading 7-day forecast for Mukono...</div>';
        }
        
        // Try different API endpoints for forecast data
        const endpoints = [
            // Endpoint 1: 5-day forecast by city name
            `https://api.openweathermap.org/data/2.5/forecast?q=Mukono&appid=${apiKey}&units=metric`,
            // Endpoint 2: 5-day forecast by coordinates (fallback)
            `https://api.openweathermap.org/data/2.5/forecast?lat=${MUKONO_LAT}&lon=${MUKONO_LON}&appid=${apiKey}&units=metric`,
            // Endpoint 3: One Call API with daily forecast (8 days)
            `https://api.openweathermap.org/data/2.5/onecall?lat=${MUKONO_LAT}&lon=${MUKONO_LON}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`
        ];
        
        let weatherData = null;
        let endpointUsed = '';
        
        // Try each endpoint until one works
        for (const endpoint of endpoints) {
            try {
                console.log('Trying endpoint:', endpoint);
                const response = await fetch(endpoint);
                
                if (response.ok) {
                    weatherData = await response.json();
                    endpointUsed = endpoint;
                    console.log('Success with endpoint:', endpoint);
                    break;
                } else {
                    console.warn('Endpoint failed:', response.status);
                }
            } catch (error) {
                console.warn('Endpoint error:', error.message);
            }
        }
        
        if (!weatherData) {
            throw new Error('All weather API endpoints failed');
        }
        
        console.log('Weather data loaded via:', endpointUsed);
        console.log('Weather data:', weatherData);
        
        // Display the weather forecast
        displayWeatherForecast(weatherData, endpointUsed);
        
        // Store in localStorage with timestamp
        localStorage.setItem('mukonoWeatherForecast', JSON.stringify({
            data: weatherData,
            timestamp: Date.now(),
            source: 'api'
        }));
        
    } catch (error) {
        console.error('Failed to load weather forecast:', error);
        displayError(error);
        
        // Try to use cached data
        const cached = localStorage.getItem('mukonoWeatherForecast');
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                const hoursAgo = (Date.now() - timestamp) / (1000 * 60 * 60);
                
                if (hoursAgo < 6) { // Use cache if less than 6 hours old
                    console.log('Using cached weather forecast from', Math.round(hoursAgo * 10) / 10, 'hours ago');
                    displayWeatherForecast(data, 'cache');
                }
            } catch (cacheError) {
                console.error('Cache error:', cacheError);
            }
        }
    }
}

function displayWeatherForecast(data, source = 'api') {
    const weatherElement = document.getElementById('weather-display');
    if (!weatherElement) {
        console.error('Weather display element not found');
        return;
    }
    
    let forecastHTML = '';
    
    // Check which API format we have
    if (data.daily) {
        // One Call API format - has daily forecast array
        console.log('Processing One Call API forecast data');
        const days = data.daily.slice(0, 7); // Get next 7 days
        
        forecastHTML = `
            <h2>7-Day Forecast for Mukono, Uganda</h2>
            <div class="forecast-grid">
                ${days.map((day, index) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = getDayName(date, index);
                    const tempMin = Math.round(day.temp.min);
                    const tempMax = Math.round(day.temp.max);
                    const condition = day.weather[0].main;
                    const description = day.weather[0].description;
                    
                    return `
                        <div class="forecast-card">
                            <div class="forecast-day">${dayName}</div>
                            <div class="forecast-icon">${getWeatherIcon(condition)}</div>
                            <div class="forecast-temps">
                                <span class="temp-high">${tempMax}°</span>
                                <span class="temp-low">${tempMin}°</span>
                            </div>
                            <div class="forecast-condition">${description}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else if (data.list) {
        // 5-day forecast API format - has list array with 3-hour intervals
        console.log('Processing 5-day forecast API data');
        
        // Group by day and get daily forecasts
        const dailyForecasts = groupForecastByDay(data.list);
        const days = dailyForecasts.slice(0, 7); // Get next 7 days
        
        forecastHTML = `
            <h2>7-Day Forecast for Mukono, Uganda</h2>
            <div class="forecast-grid">
                ${days.map((day, index) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = getDayName(date, index);
                    const tempMin = Math.round(day.temp.min);
                    const tempMax = Math.round(day.temp.max);
                    const condition = day.weather[0].main;
                    const description = day.weather[0].description;
                    
                    return `
                        <div class="forecast-card">
                            <div class="forecast-day">${dayName}</div>
                            <div class="forecast-icon">${getWeatherIcon(condition)}</div>
                            <div class="forecast-temps">
                                <span class="temp-high">${tempMax}°</span>
                                <span class="temp-low">${tempMin}°</span>
                            </div>
                            <div class="forecast-condition">${description}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        throw new Error('Unsupported forecast data format');
    }
    
            // Add cache note if using cached data
            if (source === 'cache') {
                forecastHTML += '<p class="weather-note"><small>⚠️ Using cached forecast data</small></p>';
            } else {
                forecastHTML += '<p class="weather-note"><small>📍 Mukono, Uganda</small></p>';
            }
    
    weatherElement.innerHTML = forecastHTML;
}

// Helper function to group 3-hour forecasts by day
function groupForecastByDay(forecastList) {
    const days = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!days[dayKey]) {
            days[dayKey] = {
                dt: item.dt,
                temp: { min: item.main.temp_min, max: item.main.temp_max },
                weather: [item.weather[0]],
                forecasts: []
            };
        } else {
            days[dayKey].temp.min = Math.min(days[dayKey].temp.min, item.main.temp_min);
            days[dayKey].temp.max = Math.max(days[dayKey].temp.max, item.main.temp_max);
            days[dayKey].forecasts.push(item);
        }
    });
    
    return Object.values(days);
}

// Helper function to get day names
function getDayName(date, index) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (index === 0) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function getWeatherIcon(condition) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️',
        'Smoke': '🌫️',
        'Dust': '💨',
        'Sand': '💨',
        'Ash': '🌋',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    
    return icons[condition] || '🌡️';
}

function displayError(error) {
    const weatherElement = document.getElementById('weather-display');
    if (!weatherElement) return;
    
    weatherElement.innerHTML = `
        <h2>Weather in Mukono</h2>
        <div class="weather-content error">
            <div class="weather-main">
                <div class="weather-icon">⚠️</div>
                <div class="weather-temp">--°C</div>
            </div>
            <div class="weather-details">
                <h3>Unable to Load Weather</h3>
                <p class="weather-condition">Check API key or connection</p>
                <div class="weather-stats">
                    <div class="weather-stat">
                        <span class="stat-label">Error:</span>
                        <span class="stat-value">${error.message.substring(0, 50)}...</span>
                    </div>
                </div>
                <p class="weather-note"><small>📍 Mukono, Uganda</small></p>
                <button onclick="initWeather()" class="btn btn-secondary" style="margin-top: 1rem;">
                    Retry Weather
                </button>
            </div>
        </div>
    `;
}

// Add CSS for weather display
function addWeatherStyles() {
    if (!document.querySelector('#weather-styles')) {
        const style = document.createElement('style');
        style.id = 'weather-styles';
        style.textContent = `
            /* Full-width weather section */
            .weather-section {
                width: 100%;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                padding: 2rem 0;
                margin: 2rem 0;
            }
            
            #weather-display {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
            }
            
            /* Forecast Grid Layout */
            .forecast-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            
            .forecast-card {
                background: rgba(255, 255, 255, 0.95);
                border-radius: var(--radius-lg);
                padding: 1.5rem 1rem;
                text-align: center;
                border: 1px solid var(--gray-light);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .forecast-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            
            .forecast-day {
                font-weight: 700;
                font-size: 1rem;
                color: var(--accent-color);
                margin-bottom: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .forecast-icon {
                font-size: 2.5rem;
                margin: 1rem 0;
                line-height: 1;
            }
            
            .forecast-temps {
                display: flex;
                justify-content: center;
                gap: 0.75rem;
                margin: 1rem 0;
            }
            
            .temp-high {
                font-weight: 800;
                color: var(--primary-color);
                font-size: 1.3rem;
            }
            
            .temp-low {
                font-weight: 600;
                color: var(--text-light);
                font-size: 1.1rem;
            }
            
            .forecast-condition {
                font-size: 0.9rem;
                color: var(--text-color);
                text-transform: capitalize;
                margin-top: 0.75rem;
                font-weight: 500;
            }
            
            /* Legacy styles for error state */
            .weather-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, var(--background-color) 0%, #e8f4f8 100%);
                border-radius: var(--radius-lg);
                border: 1px solid var(--gray-light);
                max-width: 600px;
                margin: 0 auto;
            }
            
            .weather-main {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .weather-icon {
                font-size: 3rem;
                line-height: 1;
            }
            
            .weather-temp {
                font-size: 3rem;
                font-weight: 700;
                color: var(--primary-color);
                line-height: 1;
            }
            
            .weather-details {
                width: 100%;
            }
            
            .weather-details h3 {
                margin-bottom: 0.5rem;
                color: var(--accent-color);
                border-bottom: none;
            }
            
            .weather-condition {
                font-size: 1.25rem;
                color: var(--text-color);
                margin-bottom: 1.5rem;
                text-transform: capitalize;
            }
            
            .weather-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
                text-align: left;
            }
            
            .weather-stat {
                background: rgba(255, 255, 255, 0.8);
                padding: 0.75rem;
                border-radius: var(--radius-sm);
                border-left: 3px solid var(--secondary-color);
            }
            
            .stat-label {
                display: block;
                font-size: 0.875rem;
                color: var(--text-light);
                margin-bottom: 0.25rem;
            }
            
            .stat-value {
                display: block;
                font-size: 1rem;
                font-weight: 600;
                color: var(--primary-color);
            }
            
            .weather-note {
                font-size: 0.875rem;
                color: var(--text-light);
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px dashed var(--gray-light);
            }
            
            .weather-content.error {
                background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
                border-color: var(--error);
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .forecast-grid {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 0.75rem;
                }
                
                .forecast-card {
                    padding: 0.75rem;
                }
                
                .forecast-day {
                    font-size: 0.8rem;
                }
                
                .forecast-icon {
                    font-size: 1.5rem;
                }
                
                .temp-high {
                    font-size: 1rem;
                }
                
                .temp-low {
                    font-size: 0.9rem;
                }
                
                .forecast-condition {
                    font-size: 0.75rem;
                }
                
                .weather-stats {
                    grid-template-columns: 1fr;
                }
                
                .weather-main {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .weather-icon {
                    font-size: 2.5rem;
                }
                
                .weather-temp {
                    font-size: 2.5rem;
                }
            }
            
            @media (max-width: 480px) {
                .forecast-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize styles when module loads
addWeatherStyles();

// Make initWeather available globally for retry button
window.initWeather = initWeather;