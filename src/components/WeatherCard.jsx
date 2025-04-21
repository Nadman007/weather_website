import React from 'react';

function WeatherCard({ data }) {
  const iconMap = {
    Clouds: 'clouds.png',
    Clear: 'clear.png',
    Rain: 'rain.png',
    Drizzle: 'drizzle.png',
    Mist: 'mist.png'
  };

  const weather = data.weather[0].main;
  const iconSrc = 'images/' + (iconMap[weather] || 'clear.png');

  return (
    <div className="weather">
      <img src={iconSrc} className="weather-icon" alt={weather} />
      <h1 className="temp">{Math.round(data.main.temp)}°C</h1>
      <h2 className="city">{data.name}</h2>
      <div className="details">
        <div className="col">
          <img src="images/humidity.png" alt="Humidity" />
          <div>
            <p className="humidity">{data.main.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
        <div className="col">
          <img src="images/wind.png" alt="Wind" />
          <div>
            <p className="wind">{data.wind.speed} km/h</p>
            <p>Wind Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
