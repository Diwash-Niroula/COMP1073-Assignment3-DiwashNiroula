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
  