import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/recommendationPage.css';
import Header from './Header';

const RecommendationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        recommendations = [],
        companion = '',
        transport = '',
        preferences = { nature: '', newPlaces: '' },
        purpose = ''
    } = location.state || {};

    const [currentDay, setCurrentDay] = useState(0);
    const [loading, setLoading] = useState(false);

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
        if (!accessToken) {
            alert("로그인 후 사용해주세요");
            navigate(`/login?redirectUri=${encodeURIComponent(window.location.href)}`);
            return;
        }
    
        setLoading(true);
    
        axios.post('/api/shortTrip/save', recommendations, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            alert("일정이 성공적으로 저장되었습니다.");
            navigate('/');  // 홈으로 리다이렉션
        })
        .catch(error => {
            console.error("일정 저장 중 오류 발생:", error);
            if (error.response && error.response.status === 401) {
                alert("인증이 필요합니다. 다시 로그인해주세요."); // 인증 오류 처리
                navigate(`/login?redirectUri=${encodeURIComponent(window.location.href)}`);
            } else {
                alert("일정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const hashtags = [
        companion && `#${companion}`,
        transport && `#${transport}`,
        preferences.nature && `#${preferences.nature === 'nature' ? '자연' : '도심'}`,
        preferences.newPlaces && `#${preferences.newPlaces === 'new' ? '새로운 지역' : '익숙한 지역'}`,
    ].filter(Boolean).join(" ");

    return (
        <div>
            <Header />
            <div className="recommendation-header">
                <p className="hashtags">{hashtags}</p>
                <p className="shortTripTitle">Bami가 추천하는 일정</p>
            </div>
            <div>
                <div className="day-plan">
                    <h3>{recommendations[currentDay].day}</h3>
                    <div>
                        {recommendations[currentDay].places.map((place, index) => {
                            const circleClass =
                                index === 0
                                    ? "circle-number first"
                                    : index === recommendations[currentDay].places.length - 1
                                    ? "circle-number last"
                                    : "circle-number middle";

                            return (
                                <div key={index} className="place-info">
                                    <div className={circleClass}>{index + 1}</div>
                                    <div className="place-details">
                                        <h4>{place.name}</h4>
                                        <p>{place.lotnoAddress}</p>
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
                            <button 
                                id="selectButton" 
                                onClick={handleSelectSchedule}
                                disabled={loading}
                            >
                                {loading ? "저장 중..." : "이 일정 선택하기"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;