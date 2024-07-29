import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/weather.css"

const Weather = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async (latitude, longitude) => {
            try {
                const response = await axios.get('http://localhost:8080/api/weather', {
                    params: {
                        nx: latitude,
                        ny: longitude
                    }
                });
                setWeather(response.data);
            } catch (error) {
                console.error('Error fetching weather data', error);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                }, (error) => {
                    console.error('Error getting location', error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        getLocation();
    }, []);

    if (!weather) {
        return <div>Loading...</div>;
    }

    return (
        <div className="weather-container">
            <div className="weather-card">
                <div className="weather-header">나의 위치</div>
                <div className="weather-content">
                    <div className="weather-details">
                        <div className="weather-city">{weather.city}</div>
                        <div className="weather-condition">대체로 맑음</div>
                    </div>
                    <div>
                        <div className="weather-temp">{weather.cur_temperature}°C</div>
                        <div className="weather-high-low">최고 {weather.high_temperature}° 최저 {weather.low_temperature}°</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;