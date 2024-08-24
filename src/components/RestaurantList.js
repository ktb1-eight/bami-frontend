import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import "../styles/restaurant.css"; // 스타일 시트 추가

const RestaurantList = ({ setCity }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [city, setLocalCity] = useState(''); // 도시 정보
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 기본 서울 시청 맛집 정보 가져오기
    const fetchDefaultRestaurants = useCallback(async () => {
        try {
            const response = await axios.get('/api/restaurant', {
                params: {
                    nx: null,
                    ny: null
                }
            });
            setRestaurants(response.data.restaurants);
            setLocalCity(response.data.city);
            setCity(response.data.city);
        } catch (error) {
            console.error('기본 맛집 정보를 가져오는 중 오류 발생', error);
        } finally {
            setLoading(false);
        }
    }, [setCity]);

    // 현재 위치 기반 맛집 정보 가져오기
    const fetchRestaurants = useCallback(async (latitude, longitude) => {
        try {
            const response = await axios.get('/api/restaurant', {
                params: {
                    nx: latitude,
                    ny: longitude
                }
            });
            setRestaurants(response.data.restaurants);
            setLocalCity(response.data.city);
            setCity(response.data.city);
        } catch (error) {
            console.error('맛집 정보를 가져오는 중 오류 발생', error);
        } finally {
            setLoading(false);
        }
    }, [setCity]);

    useEffect(() => {
        // 기본 서울 시청 주변 맛집 정보를 먼저 가져오기
        fetchDefaultRestaurants();

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchRestaurants(latitude, longitude);
                    },
                    (error) => {
                        console.error('위치 정보 가져오는 중 오류 발생, 기본 위치로 유지', error);
                    }
                );
            } else {
                console.error('이 브라우저는 위치 정보를 지원하지 않습니다. 기본 위치로 유지.');
            }
        };

        getLocation();
    }, [fetchRestaurants, fetchDefaultRestaurants]);

    if (loading) {
        return <div>Loading...</div>;
    }

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