const weatherApiKey = '268630d05214024a5ddb5c07cad98695'; // Replace with your OpenWeatherMap API key
const unsplashAccessKey = 'qjN5jEPoc2JDa1pPQVH2r2V1Y8qDQ3JXj--eY1kZUbs'; // Replace with your Unsplash API Access Key
const weatherDiv = document.getElementById('weather');
let favoriteCities = [];
const fetchWeatherData = (cityName) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${weatherApiKey}&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch weather data for ${cityName}. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayWeatherData(data);
        fetchUnsplashImage(data.name); // Fetch image based on the location name
      })
      .catch(error => handleError(error));
  };
  // Display weather data
  const displayWeatherData = (data) => {
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p><img src="${weatherIcon}" alt="${data.weather[0].description}" /></p>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Feels Like: ${data.main.feels_like}°C</p>
      <p>Condition: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Visibility: ${(data.visibility / 1000).toFixed(2)} km</p>
      <p>Pressure: ${data.main.pressure} hPa</p>
      <p>Coordinates: [Lat: ${data.coord.lat}, Lon: ${data.coord.lon}]</p>
      <p>Sunrise: ${sunrise}</p>
      <p>Sunset: ${sunset}</p>
      <button id="refreshButton">Refresh</button>
      <button id="saveFavoriteButton">Save as Favorite</button>
      <div id="imageContainer"></div>
    `;
    
    document.getElementById('refreshButton').addEventListener('click', () => fetchWeatherData(data.name));
    document.getElementById('saveFavoriteButton').addEventListener('click', () => saveFavoriteCity(data.name));
  };
  const fetchUnsplashImage = (locationName) => {
    fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(locationName)}+landscape&client_id=${unsplashAccessKey}&per_page=1`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          displayUnsplashImage(data.results[0].urls.regular);
        } else {
          displayUnsplashImage('https://via.placeholder.com/400?text=No+Image+Available'); // Placeholder if no image found
        }
      })
      .catch(error => console.error('Error fetching Unsplash image:', error));
  };
  
  const displayUnsplashImage = (imageUrl) => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = `<img src="${imageUrl}" alt="Location Image" class="weather-image" />`;
  };
  const handleError = (error) => {
    console.error('Error:', error);
    weatherDiv.innerHTML = `<p style="color: red;">Error fetching data: ${error.message}</p>`;
  };
  const saveFavoriteCity = (cityName) => {
    if (!favoriteCities.includes(cityName)) {
      favoriteCities.push(cityName);
      localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
      displayFavoriteCities();
    }
  };
  
  const removeFavoriteCity = (cityName) => {
    favoriteCities = favoriteCities.filter(city => city !== cityName);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    displayFavoriteCities();
  };
  
  const displayFavoriteCities = () => {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = favoriteCities.map(city => 
      `<div class="favorite-city">
        <button onclick="fetchWeatherData('${city}')">${city}</button>
        <button onclick="removeFavoriteCity('${city}')">Remove</button>
      </div>`
    ).join('');
  };
  const loadFavoriteCities = () => {
    const savedCities = localStorage.getItem('favoriteCities');
    if (savedCities) {
      favoriteCities = JSON.parse(savedCities);
    }
    displayFavoriteCities();
  };
  
  document.getElementById('fetchCityWeatherButton').addEventListener('click', () => {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput) {
      fetchWeatherData(cityInput);
    } else {
      alert("Please enter a city name.");
    }
  });
  
  // Initial load of favorite cities
  loadFavoriteCities();
  