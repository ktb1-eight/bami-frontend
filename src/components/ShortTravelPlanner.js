import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/shortTravelPlanner.css';
import Header from './Header';
import PreferenceSelector from './PreferenceSelector';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

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
    const [selectedPurpose, setSelectedPurpose] = useState('');
    const [gender, setGender] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);

    const companionRef = useRef(null);
    const transportRef = useRef(null);
    const preferencesRef = useRef(null);
    const calendarRef = useRef(null);

    useEffect(() => {
        if (location.state) {
            setGender(location.state.gender || '');
            setAgeGroup(location.state.ageGroup || '');
        }
    }, [location.state]);

    const handleSubmit = () => {
      if (!selectedCompanion || !selectedTransport || !Object.values(selectedPreferences).every(Boolean) || !startDate || !endDate) {
          alert('모든 필드를 선택해주세요!');
          if (!selectedCompanion) companionRef.current.scrollIntoView({ behavior: 'smooth' });
          else if (!selectedTransport) transportRef.current.scrollIntoView({ behavior: 'smooth' });
          else if (!startDate || !endDate) calendarRef.current.scrollIntoView({ behavior: 'smooth' });
          else preferencesRef.current.scrollIntoView({ behavior: 'smooth' });
          return;
      }
  
      const formatDateForBackend = (date) => {
          return date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
      };
  
      const data = {
          companion: selectedCompanion,
          transport: selectedTransport,
          preferences: selectedPreferences,
          gender: gender,
          ageGroup: ageGroup,
          location: location.state,
          travelPurpose: selectedPurpose,
          startDate: formatDateForBackend(startDate),
          endDate: formatDateForBackend(endDate),
          latitude: location.state?.latitude,
          longitude: location.state?.longitude
      };
  
      axios.post('/api/shortTrip/submit', data)
          .then(response => {
              console.log('성공:', response.data);
              console.log(location.state?.latitude);
              console.log(location.state?.longitude);
              navigate('/recommendation', {
                  state: {
                      recommendations: response.data,
                      companion: selectedCompanion,
                      transport: selectedTransport,
                      preferences: selectedPreferences,
                      purpose: selectedPurpose,
                      startDate: startDate.toISOString(), // startDate를 상태로 전달
                      endDate: endDate.toISOString(),
                      latitude: location.state?.latitude,
                      longitude: location.state?.longitude,
                  }
              });
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

    const handlePurposeClick = (purpose) => {
        setSelectedPurpose(selectedPurpose === purpose ? '' : purpose);
    };

    const handlePreferenceClick = (category, value) => {
        setSelectedPreferences((prev) => ({
            ...prev,
            [category]: prev[category] === value ? '' : value,
        }));
    };

    const handleDateChange = (update) => {
        setDateRange(update);
        setStartDate(update[0]);
        setEndDate(update[1]);
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                <span className='title'>Bami님에게 맞춤 여행을 추천해주기 전 몇가지를 알려주세요!</span>
                <div className="purpose-question">
                    <span className='question'>여행의 목적을 선택해주세요!</span>

                    <div className="purpose-button-group">
                        {['일상적인 환경 및 역할에서의 탈출, 지루함 탈피',
                            '쉴 수 있는 기회, 육체 피로 해결 및 정신적인 휴식',
                            '여행 동반자와의 친밀감 및 유대감 증진',
                            '진정한 자아 찾기 또는 자신을 되돌아볼 기회 찾기',
                            'SNS 사진 등록 등 과시',
                            '운동, 건강 증진 및 충전',
                            '새로운 경험 추구',
                            '역사 탐방, 문화적 경험 등 교육적 동기',
                            '특별한 목적(칠순여행, 신혼여행, 수학여행, 인센티브여행)',
                            '기타'].map((purpose, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePurposeClick(purpose)}
                                    className={selectedPurpose === purpose ? 'selected' : ''}
                                >
                                    {purpose}
                                </button>
                            ))}
                    </div>
                </div>
                <div className="companion" ref={companionRef}>
                    <span className='question'>동행인이 있으면 선택해주세요.</span>
                    <div className="companion-button-group">
                        {['혼자', '가족과', '연인과', '친구와', '그 외'].map((companion) => (
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
                    <span className='question'>이동수단을 선택해주세요.</span>
                    <div className="transport-button-group">
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
                    <span className='question'>선호하는 장소 타입</span>
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
                {/* 달력 */}
                <div className='calendar' ref={calendarRef}>
                    <span className='question'>여행 날짜를 선택해주세요.</span>
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        selectsRange={true} // 범위 선택 모드 활성화
                        dateFormat="yyyy년 MM월 dd일" // 한글 형식
                        dateFormatCalendar="yyyy년 M월"
                        locale={ko} // 한글 로케일 적용
                        inline
                    />
                </div>
                <button onClick={handleSubmit} className="submit-button">제출</button>
            </div>
        </div>
    );
};

export default ShortTravelPlanner;