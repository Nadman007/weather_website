import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ErrorAlert from './components/ErrorAlert';
import Lottie from 'lottie-react';
import loadingAnimation from './assets/loading.json';
import sunAnim from './assets/sun.json';
import cloudsAnim from './assets/clouds.json';
import rainAnim from './assets/rain.json';
import snowAnim from './assets/snow.json';
import mistAnim from './assets/mist.json';
import moonAnim from './assets/moon.json';

const apiKey = '4529942edc4e401f65e6754bcc771318';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHome, setShowHome] = useState(true);

  const fetchWeather = async (query) => {
    if (!query) return;
    setLoading(true);
    setError(false);
    setWeatherData(null);
    setForecastData(null);

    try {
      const res1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`);
      const data1 = await res1.json();

      const res2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`);
      const data2 = await res2.json();

      if (data1.cod === '404' || data2.cod === '404') {
        setError(true);
      } else {
        setWeatherData(data1);
        setForecastData(data2);
        setShowHome(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchByLocation = () => {
    console.log("📍 fetchByLocation triggered");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("✅ Got location:", pos.coords);

          setLoading(true);
          setError(false);
          setWeatherData(null);
          setForecastData(null);

          try {
            const res1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const data1 = await res1.json();

            const res2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const data2 = await res2.json();

            if (data1.cod === '404' || data2.cod === '404') {
              setError(true);
            } else {
              setWeatherData(data1);
              setForecastData(data2);
              setShowHome(false);
            }
          } catch {
            console.error("Error fetching weather data by location.");
            setError(true);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("❌ Geolocation failed:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            alert("⚠️ Location access denied. Please allow location permissions in your browser or search manually.");
          } else {
            alert("⚠️ Unable to access your location. Please try again.");
          }
          setError(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError(true);
    }
  };

  const getLottieByWeather = (condition, isNight = false) => {
    if (isNight && condition === 'Clear') return moonAnim;
    switch (condition) {
      case 'Clear': return sunAnim;
      case 'Clouds': return cloudsAnim;
      case 'Rain': return rainAnim;
      case 'Snow': return snowAnim;
      case 'Mist':
      case 'Haze':
      case 'Fog': return mistAnim;
      default: return sunAnim;
    }
  };

  const isNight = weatherData?.weather?.[0]?.icon?.endsWith('n');
  const currentAnimation = weatherData ? getLottieByWeather(weatherData.weather[0].main, isNight) : sunAnim;

  const renderForecast = () => {
    if (!forecastData || !forecastData.list) return null;
    const daily = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
    return (
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>5-Day Forecast</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {daily.map((item, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              borderRadius: '15px',
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)',
              flex: '1',
              textAlign: 'center',
              minWidth: '80px'
            }}>
              <p style={{ fontWeight: 600 }}>{new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <p style={{ margin: '6px 0' }}>{Math.round(item.main.temp)}°C</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`} style={{
      background: darkMode
        ? 'linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)'
        : 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.5s ease',
      padding: '2rem',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div className="card" style={{
        background: darkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        animation: 'fadeSlide 0.9s ease',
        color: darkMode ? '#f0f0f0' : '#1a1a1a',
        transition: 'all 0.3s ease'
      }}>
        <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.8rem' }}>☁️ WeatherNow</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode" style={{
              padding: '8px 12px',
              fontSize: '1.2rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              color: darkMode ? '#f0f0f0' : '#1a1a1a'
            }}>🌙</button>
            <button className="btn-location" onClick={fetchByLocation} title="Get Weather by Location" style={{
              padding: '8px 12px',
              fontSize: '1.2rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              color: darkMode ? '#f0f0f0' : '#1a1a1a'
            }}>📍</button>
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <SearchBar city={city} setCity={setCity} onSearch={() => fetchWeather(city)} />
        </div>
        {loading && <Lottie animationData={loadingAnimation} style={{ height: 120 }} loop autoplay />}
        {showHome && !weatherData && !loading && !error && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', animation: 'fadeSlide 1s ease' }}>
            <Lottie animationData={sunAnim} style={{ height: 100 }} loop autoplay />
            <h2 style={{ fontWeight: 600 }}>Welcome to the Weather App</h2>
            <p style={{ opacity: 0.8 }}>Search for any city above ☝️ to view its current weather!</p>
          </div>
        )}
        {!showHome && error && <ErrorAlert />}
        {!showHome && weatherData && !error && !loading && (
          <>
            <Lottie animationData={currentAnimation} style={{ height: 120 }} loop autoplay />
            <WeatherCard data={weatherData} />
            {renderForecast()}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
