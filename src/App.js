import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const apiKey = '072302b7fa30c1b2116b1ad01e931c99';

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      if (!location.trim()) {
        alert("Please enter a valid location.");
        return;
      }

      const encodedLocation = encodeURIComponent(location);

      const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=imperial&appid=${apiKey}`;
      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedLocation}&units=imperial&appid=${apiKey}`;
      setError('');

      axios.get(urlWeather)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setError("Error fetching weather data. Please check the location.");
        });

      axios.get(urlForecast)
        .then((response) => {
          setForecastData(response.data.list);
        })
        .catch((error) => {
          console.error("Error fetching forecast data:", error);
          setError("Error fetching forecast data. Please check the location.");
        });

      setLocation('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-8 col-md-6">
          <div className="input-group mb-4">
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="Enter Location"
              type="text"
              className="form-control"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-center">
                <h2>{data.name}</h2>
                <h1>{data.main ? `${data.main.temp.toFixed()}°F` : null}</h1>
                <p>{data.weather ? data.weather[0].main : null}</p>
              </div>
              {data.name && (
                <div className="d-flex justify-content-around mt-4">
                  <div>
                    <p><strong>{data.main ? data.main.feels_like.toFixed() : null}°F</strong></p>
                    <p>Feels Like</p>
                  </div>
                  <div>
                    <p><strong>{data.main ? data.main.humidity : null}%</strong></p>
                    <p>Humidity</p>
                  </div>
                  <div>
                    <p><strong>{data.wind ? data.wind.speed.toFixed() : null} MPH</strong></p>
                    <p>Wind Speed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {forecastData.length > 0 && (
            <div className="mt-5">
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {forecastData
                  .filter((forecast) => forecast.dt_txt.includes('12:00:00'))
                  .map((forecast, index) => {
                    const date = new Date(forecast.dt * 1000);
                    const day = date.toLocaleDateString();
                    const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

                    return (
                      <div className="col" key={index}>
                        <div className="card shadow-sm">
                          <div className="card-body text-center">
                            <p className="card-title">{day}</p>
                            <img src={weatherIcon} alt="weather icon" className="img-fluid" />
                            <p>{forecast.weather[0].main}</p>
                            <h4>{forecast.main.temp.toFixed()}°F</h4>
                            <p>Feels like: {forecast.main.feels_like.toFixed()}°F</p>
                            <p>Humidity: {forecast.main.humidity}%</p>
                            <p>Wind Speed: {forecast.wind.speed.toFixed()} MPH</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
