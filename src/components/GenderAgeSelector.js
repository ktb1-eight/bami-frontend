import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/genderAgeSelector.css';
import Header from './Header';

const GenderAgeSelector = () => {
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
    const [isApplyEnabled, setIsApplyEnabled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleGenderClick = (gender) => {
        setSelectedGender(selectedGender === gender ? '' : gender);
    };

    const handleAgeGroupClick = (ageGroup) => {
        setSelectedAgeGroup(selectedAgeGroup === ageGroup ? '' : ageGroup);
    };

    const handleNextClick = () => {
        navigate('/short-term');
    };

    const handleApplyClick = () => {
        if (!isApplyEnabled) return; // 버튼이 활성화되지 않았으면 동작하지 않음

        if (!selectedGender || !selectedAgeGroup) {
            alert('성별과 연령대를 모두 선택해주세요!');
            return;
        }

        // 위치 정보도 함께 전달
        navigate('/travel-planner', { 
            state: { 
                gender: selectedGender, 
                ageGroup: selectedAgeGroup,
                latitude: location.state?.latitude,
                longitude: location.state?.longitude
            }
        });
    };

    useEffect(() => {
        // 성별과 연령대가 모두 선택된 경우에만 적용하기 버튼을 활성화
        setIsApplyEnabled(!!selectedGender && !!selectedAgeGroup);
    }, [selectedGender, selectedAgeGroup]);

    return (
        <div>
            <Header />
            <div className="container">
                <p id="genderAgeTitle">성별/연령대를 알려주세요</p>
                <p id="description">제공해주신 정보는 여행 추천에 사용됩니다.</p>
                <div className="gender-selection">
                    <div 
                        className={`gender-card ${selectedGender === '여성' ? 'selected' : ''}`} 
                        onClick={() => handleGenderClick('여성')}
                    >
                        <div className="gender-icon female"></div>
                        <p>여성</p>
                    </div>
                    <div 
                        className={`gender-card ${selectedGender === '남성' ? 'selected' : ''}`} 
                        onClick={() => handleGenderClick('남성')}
                    >
                        <div className="gender-icon male"></div>
                        <p>남성</p>
                    </div>
                </div>
                <div className="button-group">
                    {['20대 미만', '20대', '30대', '40대', '50대', '60대 이상'].map(ageGroup => (
                        <button
                            key={ageGroup}
                            className={selectedAgeGroup === ageGroup ? 'selected' : ''}
                            onClick={() => handleAgeGroupClick(ageGroup)}
                        >
                            {ageGroup}
                        </button>
                    ))}
                </div>
                <div className="action-buttons">
                    <button className="next-button" onClick={handleNextClick}>이전으로</button>
                    <button 
                        className={`apply-button ${isApplyEnabled ? 'enabled' : 'disabled'}`} 
                        onClick={handleApplyClick}
                    >
                        다음으로
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenderAgeSelector;