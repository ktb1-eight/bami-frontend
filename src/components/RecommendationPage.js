import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/recommendationPage.css';
import Header from './Header';
import KakaoMapWithDirections from './KakaoMapWithDirections';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecommendationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        recommendations = [],
        companion = '',
        transport = '',
        preferences = { nature: '', newPlaces: '' },
        purpose = '',
        startDate = '',
        endDate = '',
    } = location.state || {};

    const [currentDay, setCurrentDay] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {});
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    if (!recommendations.length) {
        return <p>추천 데이터를 가져오는 중 오류가 발생했습니다.</p>;
    }

    const handleNextDay = () => {
        setCurrentDay((prevDay) => Math.min(prevDay + 1, recommendations.length - 1));
    };

    const handlePreviousDay = () => {
        setCurrentDay((prevDay) => Math.max(prevDay - 1, 0));
    };

    const handleSelectSchedule = () => {
        const accessToken = localStorage.getItem('accessToken');
        const post_data = {
            recommendations: recommendations,
            startDate: startDate,
            endDate: endDate,
            latitude: location.state?.latitude,
            longitude: location.state?.longitude,
        };

        if (!accessToken) {
            navigate(process.env.REACT_APP_PROXY + `/login?redirectUri=${encodeURIComponent(window.location.href)}`);
            return;
        }

        setLoading(true);

        axios.post(process.env.REACT_APP_PROXY + '/api/shortTrip/save', post_data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response) => {
            toast.success('일정이 성공적으로 저장되었습니다.', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => navigate('/myTravel'), 2000);
        })
        .catch((error) => {
            console.error('일정 저장 중 오류 발생:', error);
            if (error.response && error.response.status === 401) {
                alert('인증이 필요합니다. 다시 로그인해주세요.');
                navigate(`/login?redirectUri=${encodeURIComponent(window.location.href)}`);
            } else {
                alert('일정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleRetryRequest = () => {
        setLoading(true);

        const data = {
            companion: companion,
            transport: transport,
            preferences: preferences,
            gender: location.state.gender || '',
            ageGroup: location.state.ageGroup || '',
            location: location.state,
            travelPurpose: purpose,
        };

        axios.post(process.env.REACT_APP_PROXY + '/api/shortTrip/submit', data)
        .then((response) => {
            navigate(process.env.REACT_APP_PROXY + '/recommendation', {
                state: {
                    recommendations: response.data,
                    companion: companion,
                    transport: transport,
                    preferences: preferences,
                    purpose: purpose,
                    startDate: startDate,
                    endDate: endDate,
                },
            });
        })
        .catch((error) => {
            console.error('일정 다시 추천받기 중 오류 발생:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const getFormattedDate = (dateString, daysToAdd) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + daysToAdd);
        const options = { month: 'long', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('ko-KR', options);
    };

    const hashtags = [
        companion && `#${companion}`,
        transport && `#${transport}`,
        preferences.nature && `#${preferences.nature === 'nature' ? '자연' : '도심'}`,
        preferences.newPlaces && `#${preferences.newPlaces === 'new' ? '새로운 지역' : '익숙한 지역'}`,
    ]
    .filter(Boolean)
    .join(' ');

    return (
        <div>
            <Header />
            <KakaoMapWithDirections 
                recommendations={recommendations[currentDay].places} 
                apiKey={process.env.REACT_APP_KAKAO_MAP_API_KEY}
            />
            <div className="recommendation-header">
                <p className="hashtags">{hashtags}</p>
                <p className="shortTripTitle">Bami가 추천하는 일정</p>
            </div>
            <div className="day-plan">
                <div className="day-header">
                    <h3>{recommendations[currentDay].day} <span className="date-text">{getFormattedDate(startDate, currentDay)}</span></h3>
                    <button className="retry-button" onClick={handleRetryRequest} disabled={loading}>
                        일정 다시 추천받기
                    </button>
                </div>
                <div>
                    {recommendations[currentDay].places.map((place, index) => {
                        const circleClass = index === 0
                            ? 'circle-number first'
                            : index === recommendations[currentDay].places.length - 1
                            ? 'circle-number last'
                            : 'circle-number middle';

                        return (
                            <div key={index} className="place-info">
                                <div className={circleClass}>{index + 1}</div>
                                <div className="place-details">
                                    <h4>{place.name}</h4>
                                    <p>{place.city}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="navigation-buttons">
                    {currentDay > 0 && <button id="prevButton" onClick={handlePreviousDay}>이전</button>}
                    {currentDay < recommendations.length - 1 ? (
                        <button id="nextButton" onClick={handleNextDay}>다음</button>
                    ) : (
                        <button id="selectButton" onClick={handleSelectSchedule} disabled={loading}>
                            {loading ? '저장 중...' : '이 일정 선택하기'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;