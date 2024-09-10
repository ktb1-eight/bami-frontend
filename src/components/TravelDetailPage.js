import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import Header from '../components/Header';
import '../styles/travelDetailPage.css';

const TravelDetailPage = () => {
    const location = useLocation();
    const { plan } = location.state || {};

    const [currentDay, setCurrentDay] = useState(0);

    if (!plan) {
        return <p>여행 정보를 불러오는 중 오류가 발생했습니다.</p>;
    }

    const handleNextDay = () => {
        setCurrentDay((prevDay) => Math.min(prevDay + 1, plan.recommendations.length - 1));
    };

    const handlePreviousDay = () => {
        setCurrentDay((prevDay) => Math.max(prevDay - 1, 0));
    };

    const getFormattedDate = (dateString, daysToAdd) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + daysToAdd);
        
        const options = { month: 'long', day: 'numeric', weekday: 'short' };
        const formattedDate = date.toLocaleDateString('ko-KR', options);

        return formattedDate;
    };

    return (
        <div>
            <Header />
            <div className="travel-detail-header">
                <p className="shortTripTitle">내 여행 일정</p>
            </div>
            <div>
                <div className="day-plan">
                    <div className="day-header">
                        <h3>
                            {plan.recommendations[currentDay].day} 
                            <span className="date-text"> {getFormattedDate(plan.startDate, currentDay)}</span>
                        </h3>
                    </div>
                    <div>
                        {plan.recommendations[currentDay].places.map((place, index) => {
                            const circleClass =
                                index === 0
                                    ? "circle-number first"
                                    : index === plan.recommendations[currentDay].places.length - 1
                                    ? "circle-number last"
                                    : "circle-number middle";

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
                        {currentDay < plan.recommendations.length - 1 && (
                            <button id="nextButton" onClick={handleNextDay}>다음</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelDetailPage;