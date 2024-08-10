import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/restaurant.css"; // 스타일 시트 추가

const RestaurantList = ({ setCity }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async (latitude, longitude) => {
            try {
                const response = await axios.get('/api/restaurant', {
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
                    <div
                        key={index}
                        className="restaurant-card"
                        onClick={() => window.open(restaurant.placeURL, "_blank")}
                        style={{
                            backgroundImage: `url(${restaurant.imageURL})`,
                        }}
                    >
                        <div className="restaurant-info">
                            <h2>{restaurant.name}</h2>
                            <p>{restaurant.category}</p>
                            <p>{(restaurant.distance / 1000).toFixed(1)}km</p>
                            <p>영업중</p>
                            <div className="restaurant-rating">
                                <span>{restaurant.rating.toFixed(1)}</span>
                                <span>★</span>
                                <span>{restaurant.userRatingsTotal}건</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;