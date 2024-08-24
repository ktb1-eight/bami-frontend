import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import "../styles/weather.css";

const Weather = () => {
    const [weather, setWeather] = useState(null);

    // 위도와 경도에 따른 날씨 데이터를 가져오는 함수
    const fetchWeather = useCallback(async (latitude, longitude) => {
        try {
            const response = await axios.get('/api/weather', {
                params: {
                    nx: latitude,
                    ny: longitude
                }
            });
            setWeather(response.data);
        } catch (error) {
            console.error('날씨 데이터를 가져오는 중 오류 발생', error);
        }
    }, []);

    // 기본 날씨 데이터 (서울시청) 가져오기
    const fetchDefaultWeather = useCallback(async () => {
        try {
            const response = await axios.get('/api/weather', {
                params: {
                    nx: null,
                    ny: null
                }
            });
            setWeather(response.data);
        } catch (error) {
            console.error('기본 날씨 데이터를 가져오는 중 오류 발생', error);
        }
    }, []);

    useEffect(() => {
        // 먼저 기본 날씨(서울시청) 가져오기
        fetchDefaultWeather();

        // 사용자의 위치를 가져와 날씨 데이터를 요청
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                }, (error) => {
                    console.error('위치 정보 가져오는 중 오류 발생, 기본 날씨로 유지', error);
                });
            } else {
                console.error('이 브라우저는 위치 정보를 지원하지 않습니다. 기본 날씨로 유지.');
            }
        };

        getLocation();
    }, [fetchDefaultWeather, fetchWeather]);

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
                        <div className="weather-condition">대체로 맑음</div> {/* 이 부분은 날씨 정보에 따라 동적으로 변경 가능 */}
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