import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/restaurant.css"; // 스타일 시트 추가

const RestaurantList = ({ setCity }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async (latitude, longitude) => {
            try {
                const response = await axios.get('http://localhost:8080/api/restaurant', {
                    params: {
                        nx: latitude,
                        ny: longitude
                    }
                });
                setRestaurants(response.data.restaurants);
                setCity(response.data.city);  // 도시 이름 설정
            } catch (error) {
                console.error('Error fetching restaurants', error);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    fetchRestaurants(latitude, longitude);
                }, (error) => {
                    console.error('Error getting location', error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        getLocation();
    }, [setCity]);

    return (
        <div className="restaurant-container">
            <div className="restaurant-grid">
                {restaurants.map((restaurant, index) => (
                    <div key={index} className="restaurant-card" onClick={() => window.open(restaurant.placeURL, "_blank")}>
                        <div className="restaurant-info">
                            <h2>{restaurant.name}</h2>
                            <p>주소 : {restaurant.address}</p>
                            <p>카테고리 : {restaurant.category}</p>
                            <p>거리 : {restaurant.distance} m</p>
                            <p>전화번호 : {restaurant.phone}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;