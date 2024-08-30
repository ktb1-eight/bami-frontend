import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import "../styles/myTravel.css"
import { removeCitySuffix } from './longRecommendationResult';

const MyTravel = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [cityImages, setCityImages] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            axios.get('/api/user/retrieve-info', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then(response => {
                if (response.status === 200 && response.data) {
                    setUserInfo(response.data); // userInfo 설정
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
    }, [navigate]);

    useEffect(() => {
        if (userInfo && userInfo.travelDestinations) {
            userInfo.travelDestinations.forEach(destination => {
                axios.get(`/api/city-image/${destination.location} 풍경`)
                    .then(response => {
                        if (response.data.items && response.data.items.length > 0) {
                            const imageUrls = response.data.items.map(item => item.link); // 모든 이미지 링크 저장
                            setCityImages(prevState => ({
                                ...prevState,
                                [destination.location]: { imageUrls, currentImageIndex: 0 }
                            }));
                        } else {
                            console.error(`No images found for ${destination.location}`);
                        }
                    })
                    .catch(error => {
                        console.error(`이미지 로딩 실패: ${destination.location}`, error);
                    });
            });
        }
    }, [userInfo]);

    const handleImageError = (location) => {
        setCityImages(prevState => {
            const cityData = prevState[location];
            if (cityData && cityData.currentImageIndex < cityData.imageUrls.length - 1) {
                return {
                    ...prevState,
                    [location]: {
                        ...cityData,
                        currentImageIndex: cityData.currentImageIndex + 1
                    }
                };
            } else {
                return prevState; // 더 이상 변경하지 않음
            }
        });
    };

    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsScrolling(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsScrolling(false);
    };

    const handleMouseUp = () => {
        setIsScrolling(false);
    };

    const handleMouseMove = (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX) * 1; // 스크롤 속도 조절
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

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
                    {userInfo && userInfo.travelDestinations && (
                        <div 
                            className="travel-card-container"
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {userInfo.travelDestinations
                                .filter(destination => !destination.visited)
                                .map(destination => (
                                    <div className="travel-card" key={destination.id}>
                                        {cityImages[destination.location] && (
                                            <img
                                                src={cityImages[destination.location].imageUrls[cityImages[destination.location].currentImageIndex]}
                                                alt={destination.location}
                                                onError={() => handleImageError(destination.location)} // 이미지 로드 실패 시 다음 이미지로
                                            />
                                        )}
                                        <div className='travel-card-text'>
                                            <p className="location-text">{removeCitySuffix(destination.location)}</p>
                                            <p className="date-text">
                                                {new Date(destination.startDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} ~ {new Date(destination.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </div>
                <div id='prev-travel'>
                    <p>지난 여행</p>
                    {userInfo && userInfo.travelDestinations && (
                        <div 
                            className="travel-card-container"
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {userInfo.travelDestinations
                                .filter(destination => destination.visited)
                                .map(destination => (
                                    <div className="travel-card" key={destination.id}>
                                        {cityImages[destination.location] && (
                                            <img
                                                src={cityImages[destination.location].imageUrls[cityImages[destination.location].currentImageIndex]}
                                                alt={destination.location}
                                                onError={() => handleImageError(destination.location)} // 이미지 로드 실패 시 다음 이미지로
                                            />
                                        )}
                                        <div className='travel-card-text'>
                                            <p className="location-text">{destination.location}</p>
                                            <p className="date-text">
                                                {new Date(destination.startDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} ~ {new Date(destination.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTravel;
