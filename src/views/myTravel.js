import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import "../styles/myTravel.css"

const MyTravel = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [travelPlans, setTravelPlans] = useState([]);
    const [cityImages, setCityImages] = useState({});
    const navigate = useNavigate();

    const fetchTravelPlans = useCallback((accessToken) => {
        axios.get(process.env.REACT_APP_PROXY + '/api/user/travel-plans', {
            headers: { 
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(response => {
            // 여행 계획을 날짜별로 정렬
            const sortedPlans = response.data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
            setTravelPlans(sortedPlans);
            loadCityImages(sortedPlans);
        })
        .catch(error => {
            console.error('여행 계획 로딩 실패:', error);
        });
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios.get(process.env.REACT_APP_PROXY + '/api/user/retrieve-info', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then(response => {
                if (response.status === 200 && response.data) {
                    setUserInfo(response.data);
                    fetchTravelPlans(accessToken);
                } else {
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('로그인 정보 없음:', error);
                localStorage.removeItem('accessToken');
            })
        } else {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
        }
    }, [navigate, fetchTravelPlans]);

    const loadCityImages = (plans) => {
        plans.forEach(plan => {
            const firstPlace = plan.recommendations[0].places[0];
            axios.get(process.env.REACT_APP_PROXY + `/api/city-image/${firstPlace.name} 풍경`)
                .then(response => {
                    if (response.data.items && response.data.items.length > 0) {
                        const imageUrls = response.data.items.map(item => item.link);
                        setCityImages(prevState => ({
                            ...prevState,
                            [plan.id]: { imageUrls, currentImageIndex: 0 }
                        }));
                    } else {
                        console.error(`No images found for ${firstPlace.name}`);
                    }
                })
                .catch(error => {
                    console.error(`이미지 로딩 실패: ${firstPlace.name}`, error);
                });
        });
    };

    const handleImageError = (planId) => {
        setCityImages(prevState => {
            const cityData = prevState[planId];
            if (cityData && cityData.currentImageIndex < cityData.imageUrls.length - 1) {
                return {
                    ...prevState,
                    [planId]: {
                        ...cityData,
                        currentImageIndex: cityData.currentImageIndex + 1
                    }
                };
            } else {
                return prevState;
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    };

    const handleCardClick = (plan) => {
        navigate('/travel-detail', { state: { plan } });
    };

    const today = new Date();

    return (
        <div>
            <Header />
            <div id='my-travel-container'>
                {userInfo && (
                    <div id='my-travel-profile'>
                        <img src={userInfo.image} alt="User profile" />
                        <p>{userInfo.name} 님의 여행</p>
                    </div>
                )}
                <div id='upcoming-travel'>
                    <p>예정된 여행</p>
                    <div className="travel-card-container">
                        {travelPlans
                            .filter(plan => new Date(plan.endDate) >= today)
                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                            .map(plan => (
                                <div 
                                    className="travel-card" 
                                    key={plan.id} 
                                    onClick={() => handleCardClick(plan)}
                                >
                                    {cityImages[plan.id] && (
                                        <img
                                            src={cityImages[plan.id].imageUrls[cityImages[plan.id].currentImageIndex]}
                                            alt={plan.recommendations[0].places[0].name}
                                            onError={() => handleImageError(plan.id)}
                                        />
                                    )}
                                    <div className='travel-card-text'>
                                        {/* address를 출력 */}
                                        <p className="location-text">{plan.address}</p>  
                                        <p className="date-text">
                                            {formatDate(plan.startDate)} ~ {formatDate(plan.endDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div id='prev-travel'>
                    <p>지난 여행</p>
                    <div className="travel-card-container">
                        {travelPlans
                            .filter(plan => new Date(plan.endDate) < today)
                            .map(plan => (
                                <div 
                                    className="travel-card" 
                                    key={plan.id}
                                    onClick={() => handleCardClick(plan)}
                                >
                                    {cityImages[plan.id] && (
                                        <img
                                            src={cityImages[plan.id].imageUrls[cityImages[plan.id].currentImageIndex]}
                                            alt={plan.recommendations[0].places[0].name}
                                            onError={() => handleImageError(plan.id)}
                                        />
                                    )}
                                    <div className='travel-card-text'>
                                        {/* address를 출력 */}
                                        <p className="location-text">{plan.address}</p>  
                                        <p className="date-text">
                                            {formatDate(plan.startDate)} ~ {formatDate(plan.endDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTravel;