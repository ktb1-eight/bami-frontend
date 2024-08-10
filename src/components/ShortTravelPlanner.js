import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/shortTravelPlanner.css';
import Header from './Header';

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

    const companionRef = useRef(null);
    const transportRef = useRef(null);
    const preferencesRef = useRef(null);

    const handleSubmit = () => {
        if (!selectedCompanion || !selectedTransport || !selectedPreferences.nature || !selectedPreferences.duration || !selectedPreferences.newPlaces || !selectedPreferences.relaxation || !selectedPreferences.exploration || !selectedPreferences.planning || !selectedPreferences.photography) {
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
            location: location.state // 마커의 위치 정보 포함
        };

        // 백엔드로 데이터 전송
        fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('성공:', data);
            // 성공적으로 제출된 후 필요한 작업을 여기에 추가
            navigate('/');
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
                <div className="preference">
                  <span className="left-name">자연</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('nature', value)}
                      className={`${selectedPreferences.nature === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">도심</span>
                </div>
                <div className="preference">
                  <span className="left-name">숙박</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('duration', value)}
                      className={`${selectedPreferences.duration === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">당일</span>
                </div>
                <div className="preference">
                  <span className="left-name">새로운 지역</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('newPlaces', value)}
                      className={`${selectedPreferences.newPlaces === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">익숙한 지역</span>
                </div>
                <div className="preference">
                  <span className="left-name">휴양, 휴식</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('relaxation', value)}
                      className={`${selectedPreferences.relaxation === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">체험활동</span>
                </div>
                <div className="preference">
                  <span className="left-name">잘 알려지지 않은 방문지</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('exploration', value)}
                      className={`${selectedPreferences.exploration === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">알려진 방문지</span>
                </div>
                <div className="preference">
                  <span className="left-name">계획에 따른 여행</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('planning', value)}
                      className={`${selectedPreferences.planning === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">상황에 따른 여행</span>
                </div>
                <div className="preference">
                  <span className="left-name">사진 촬영 중요하지 않음</span>
                  {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceClick('photography', value)}
                      className={`${selectedPreferences.photography === value ? 'selected' : ''} size-${index + 1}`}
                    />
                  ))}
                  <span className="right-name">사진 촬영 중요</span>
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="submit-button">제출</button>
          </div>
        </div>
      );
    };

export default ShortTravelPlanner;