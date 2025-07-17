const searchtxt = document.getElementById('searchtxt');
const searchButtons = document.getElementById('searchButtons');
const locationButton = document.getElementById('locationButton');
const recentsearch = document.getElementById('recentsearch');
const errorMassage = document.getElementById('errorMassage');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const forecastContainer = document.getElementById('forecastContainer');

// API Configuration
const apiKEY = 'd34c16bb0358c650bee597c3084eb8d2'; // added key from openewthermap website
const siteURL = 'https://api.openweathermap.org/data/2.5'; // website link

let recentList = JSON.parse(localStorage.getItem('recentsearch')) || [];

function init() {
    setupEvent();
    updateRecentSearches();
}

// Set up event listeners
function setupEvent() {
    searchButtons.addEventListener('click', searchWeather);
    locationButton.addEventListener('click', getCurrentLocation); //
    searchtxt.addEventListener('input', debounce(updateRecentSearches, 300));
    searchtxt.addEventListener('focus', updateRecentSearches);
    searchtxt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    searchtxt.addEventListener('blur', () => {
        // Add a small delay to allow click events on recent search items to register
        setTimeout(() => {
            recentsearch.classList.add('hidden');
        }, 200); 
    });
}
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function updateRecentSearches() {
    if (recentList.length === 0) {
        recentsearch.classList.add('hidden');
        return;
    }

    recentsearch.innerHTML = '';
    recentsearch.classList.remove('hidden');

    recentList.forEach(city => {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
        item.textContent = city;
        item.addEventListener('click', () => {
            searchtxt.value = city;
            searchWeather();
            recentsearch.classList.add('hidden');
        });
        recentsearch.appendChild(item);
    });
}

// Search weather by city name
function searchWeather() {
    const city = searchtxt.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    WeatherData(city);
    recentsearch.classList.add('hidden');
}

// Get current location weather
function getCurrentLocation() { 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
            position => {
                const { latitude, longitude } = position.coords;
                WeatherByCoords(latitude, longitude);
            },
            error => {
                showError('Unable to retrieve your location. Please allow location access.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// Fetch weather data by coordinates
function WeatherByCoords(lat, lon) {
    const url = `${siteURL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKEY}`; 

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Weather data not available');
            return response.json();
        })
        .then(data => {
            addToRecentSearches(data.name); 
            displayCurrentWeather(data);
            fetchForecast(data.name);
        })
        .catch(error => {
            showError('Failed to fetch weather data. Please try again.');
            console.error('Error fetching weather by coordinates:', error);
        });
}

// Fetch weather data by city name
function WeatherData(city) {
    const url = `${siteURL}/weather?q=${city}&units=metric&appid=${apiKEY}`; // **changed baseURL to siteURL**

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            addToRecentSearches(data.name); 
            displayCurrentWeather(data);
            fetchForecast(data.name);
        })
        .catch(error => {
            showError('City not found. Please check the spelling and try again.');
            console.error('Error fetching weather data:', error);
        });
}

// Fetch 5-day forecast
function fetchForecast(city) {
    const url = `${siteURL}/forecast?q=${city}&units=metric&appid=${apiKEY}`; 

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Forecast data not available');
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            showError('Failed to fetch forecast data. Please try again.');
            console.error('Error fetching forecast:', error);
        });
}

// Separate function to update recent list without recursion
function addToRecentSearches(city) {  // function to avoid recursive call
    // Remove if already exists
    recentList = recentList.filter(item => item.toLowerCase() !== city.toLowerCase());

    recentList.unshift(city);

    // Keep only last 5 searches
    if (recentList.length > 5) {
        recentList.pop();
    }

    // Save to local storage
    localStorage.setItem('recentsearch', JSON.stringify(recentList));

   
}

// Display current weather
function displayCurrentWeather(data) {
    errorMassage.classList.add('hidden'); // hiding error msg

    // current weather section
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('dateTime').textContent = new Date().toLocaleString();
    document.getElementById('abWeather').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} km/h`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const weatherIcon = document.getElementById('weatherIcon');
    if (weatherIcon) {
        weatherIcon.innerHTML = getWeatherIcon(iconCode);
    }

    // Show current weather section
    currentWeather.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(data) {
    forecastContainer.innerHTML = '';

    // Group forecast by day
    const dailyData = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    // Display next 5 days
    let count = 0;
    for (const date in dailyData) {
        if (count >= 5) break;

        const dayData = dailyData[date];
        const dayInfo = {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: Math.round(dayData[0].main.temp),
            icon: dayData[0].weather[0].icon,
            humidity: dayData[0].main.humidity,
            wind: dayData[0].wind.speed
        };

        const forecastCard = createForecastCard(dayInfo);
        forecastContainer.appendChild(forecastCard);
        count++;
    }

    // Show forecast section
    forecast.classList.remove('hidden');
}

// Create forecast card
function createForecastCard(data) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-4 text-center';

    card.innerHTML = `
        <p class="font-medium text-gray-800 mb-2">${data.date}</p>
        <div class="text-4xl my-2 text-blue-500">
            ${getWeatherIcon(data.icon)}
        </div>
        <p class="text-2xl font-bold text-gray-800 mb-2">${data.temp}°C</p>
        <div class="flex justify-between text-sm text-gray-600 mt-3">
            <div>
                <p>Humidity</p>
                <p class="font-medium">${data.humidity}%</p>
            </div>
            <div>
                <p>Wind</p>
                <p class="font-medium">${data.wind} km/h</p>
            </div>
        </div> `;
    return card;
}

// Get weather icon
function getWeatherIcon(iconCode) {
            const iconMap = {
                '01d': '<i class="fas fa-sun"></i>',
                '01n': '<i class="fas fa-moon"></i>',
                '02d': '<i class="fas fa-cloud-sun"></i>',
                '02n': '<i class="fas fa-cloud-moon"></i>',
                '03d': '<i class="fas fa-cloud"></i>',
                '03n': '<i class="fas fa-cloud"></i>',
                '04d': '<i class="fas fa-cloud"></i>',
                '04n': '<i class="fas fa-cloud"></i>',
                '09d': '<i class="fas fa-cloud-showers-heavy"></i>',
                '09n': '<i class="fas fa-cloud-showers-heavy"></i>',
                '10d': '<i class="fas fa-cloud-sun-rain"></i>',
                '10n': '<i class="fas fa-cloud-moon-rain"></i>',
                '11d': '<i class="fas fa-bolt"></i>',
                '11n': '<i class="fas fa-bolt"></i>',
                '13d': '<i class="fas fa-snowflake"></i>',
                '13n': '<i class="fas fa-snowflake"></i>',
                '50d': '<i class="fas fa-smog"></i>',
                '50n': '<i class="fas fa-smog"></i>'
            };
            
            return iconMap[iconCode] || '<i class="fas fa-cloud"></i>';
        }

        // Show error message
        function showError(message) {
            errorMassage.textContent = message;
            errorMassage.classList.remove('hidden');
            currentWeather.classList.add('hidden');
            forecast.classList.add('hidden');
        }

        // Initialize the app
        init();


