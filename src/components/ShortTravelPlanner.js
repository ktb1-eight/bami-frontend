import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/shortTravelPlanner.css';
import Header from './Header';
import PreferenceSelector from './PreferenceSelector';

const ShortTravelPlanner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCompanion, setSelectedCompanion] = useState('');
    const [selectedTransport, setSelectedTransport] = useState('');
    const [selectedPreferences, setSelectedPreferences] = useState({
        nature: '',
        duration: '',
        newPlaces: '',
        relaxation: '',
        exploration: '',
        planning: '',
        photography: '',
    });
    const [gender, setGender] = useState('');
    const [ageGroup, setAgeGroup] = useState('');

    const companionRef = useRef(null);
    const transportRef = useRef(null);
    const preferencesRef = useRef(null);

    useEffect(() => {
        if (location.state) {
            setGender(location.state.gender || '');
            setAgeGroup(location.state.ageGroup || '');
        }
    }, [location.state]);

    const handleSubmit = () => {
        if (!selectedCompanion || !selectedTransport || !Object.values(selectedPreferences).every(Boolean)) {
            alert('모든 필드를 선택해주세요!');
            if (!selectedCompanion) companionRef.current.scrollIntoView({ behavior: 'smooth' });
            else if (!selectedTransport) transportRef.current.scrollIntoView({ behavior: 'smooth' });
            else preferencesRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const data = {
            companion: selectedCompanion,
            transport: selectedTransport,
            preferences: selectedPreferences,
            gender: gender,
            ageGroup: ageGroup,
            location: location.state // 마커의 위치 정보 포함
        };

        axios.post('/api/submit', data)
            .then(response => {
                console.log('성공:', response.data);
                navigate('/'); // 성공적으로 제출된 후 홈 페이지로 이동
            })
            .catch(error => {
                console.error('오류:', error);
            });
    };

    const handleCompanionClick = (companion) => {
        setSelectedCompanion(selectedCompanion === companion ? '' : companion);
    };

    const handleTransportClick = (transport) => {
        setSelectedTransport(selectedTransport === transport ? '' : transport);
    };

    const handlePreferenceClick = (category, value) => {
        setSelectedPreferences((prev) => ({
            ...prev,
            [category]: prev[category] === value ? '' : value,
        }));
    };


    return (
        <div>
          <Header />
          <div className="form-container">
            <h2>Bami님에게 맞춤 여행을 추천해주기 전 몇가지를 알려주세요!</h2>
            <div className="companion" ref={companionRef}>
              <h3>동행인이 있으면 선택해주세요.</h3>
              <div className="button-group">
                {['혼자', '가족과', '연인과', '친구와', '반려동물과'].map((companion) => (
                  <button
                    key={companion}
                    onClick={() => handleCompanionClick(companion)}
                    className={selectedCompanion === companion ? 'selected' : ''}
                  >
                    {companion}
                  </button>
                ))}
              </div>
            </div>
            <div ref={transportRef}>
              <h3>이동수단을 선택해주세요.</h3>
              <div className="button-group">
                {['차량 이용', '대중교통'].map((transport) => (
                  <button
                    key={transport}
                    onClick={() => handleTransportClick(transport)}
                    className={selectedTransport === transport ? 'selected' : ''}
                  >
                    {transport}
                  </button>
                ))}
              </div>
            </div>
            <div ref={preferencesRef}>
              <h3>여행 선호도를 선택해주세요.</h3>
              <div className="preference-group">
                <PreferenceSelector
                  category="nature"
                  leftLabel="자연"
                  rightLabel="도심"
                  selectedValue={selectedPreferences.nature}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="duration"
                  leftLabel="숙박"
                  rightLabel="당일"
                  selectedValue={selectedPreferences.duration}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="newPlaces"
                  leftLabel="새로운 지역"
                  rightLabel="익숙한 지역"
                  selectedValue={selectedPreferences.newPlaces}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="relaxation"
                  leftLabel="휴양, 휴식"
                  rightLabel="체험활동"
                  selectedValue={selectedPreferences.relaxation}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="exploration"
                  leftLabel="잘 알려지지 않은 방문지"
                  rightLabel="알려진 방문지"
                  selectedValue={selectedPreferences.exploration}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="planning"
                  leftLabel="계획에 따른 여행"
                  rightLabel="상황에 따른 여행"
                  selectedValue={selectedPreferences.planning}
                  onClick={handlePreferenceClick}
                />
                <PreferenceSelector
                  category="photography"
                  leftLabel="사진 촬영 중요하지 않음"
                  rightLabel="사진 촬영 중요"
                  selectedValue={selectedPreferences.photography}
                  onClick={handlePreferenceClick}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="submit-button">제출</button>
          </div>
        </div>
      );
};

export default ShortTravelPlanner;