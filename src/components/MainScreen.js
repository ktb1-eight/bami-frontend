// src/components/MainScreen.js

import React, { useState } from 'react';
import "../styles/main.css";
import Weather from './Weather';
import RestaurantList from './RestaurantList';
import Header from './Header';

const MainScreen = () => {
  const [city, setCity] = useState();

  return (
    <div className="main-screen">
      <Header />
      <main>
        <div className="intro">
          <h1>한달살이에 특화된<div>새로운 여행 플래너</div></h1>
          <p>AI가 도와주는 Bami와 함께 빠르게 스케줄링 해보세요</p>
          <button id = "startButton">여행지 추천 받기</button>
        </div>
        <div className="content">
          <div className="left-section">
            <div className="weather-section">
              <h2>현재 접속 위치 기준</h2>
              <Weather />
            </div>
            <div className="travel-section">
              <h2>다가 오는 여행</h2>
              <Weather />
            </div>
          </div>
          <div className="right-section">
            <div className="restaurant-section">
              <h2>{city} 주변 1km</h2>
              <RestaurantList setCity={setCity} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainScreen;