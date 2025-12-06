// Weather functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentWeather = document.getElementById('current-weather');
    const forecastWeather = document.getElementById('forecast-weather');

    // Static weather data for Mukono, Uganda
    const weatherData = {
        current: {
            temperature: 24,
            condition: "Partly Cloudy",
            humidity: 65,
            wind: 3.2
        },
        forecast: [
            { day: "Today", high: 26, low: 18, condition: "Partly Cloudy" },
            { day: "Tomorrow", high: 27, low: 19, condition: "Sunny" },
            { day: "Saturday", high: 25, low: 19, condition: "Light Rain" },
            { day: "Sunday", high: 23, low: 17, condition: "Rainy" },
            { day: "Monday", high: 25, low: 18, condition: "Cloudy" }
        ]
    };

    // Display current weather
    if (currentWeather) {
        currentWeather.innerHTML = `
            <div class="weather-info">
                <p><strong>Temperature:</strong> ${weatherData.current.temperature}°C</p>
                <p><strong>Condition:</strong> ${weatherData.current.condition}</p>
                <p><strong>Humidity:</strong> ${weatherData.current.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${weatherData.current.wind} m/s</p>
            </div>
        `;
    }

    // Display 5-day forecast
    if (forecastWeather) {
        let forecastHTML = '<div class="forecast-grid">';
        weatherData.forecast.forEach(day => {
            forecastHTML += `
                <div class="forecast-day">
                    <p class="day-name"><strong>${day.day}</strong></p>
                    <p class="condition">${day.condition}</p>
                    <p class="temps"><span>${day.high}°</span> / <span>${day.low}°</span></p>
                </div>
            `;
        });
        forecastHTML += '</div>';
        forecastWeather.innerHTML = forecastHTML;
    }
});