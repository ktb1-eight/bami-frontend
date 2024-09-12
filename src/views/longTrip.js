import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/long_trip.css';
import '../styles/calendar.css';
import Header from '../components/Header';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';

import PreferenceSelector from '../components/PreferenceSelector';
import { reasons, transports, transportsValue, activities, togethers } from '../data/long_trip_data';
import 'react-datepicker/dist/react-datepicker.css';

const cities = {
    "서울특별시": 11,
    "부산광역시": 26,
    "대구광역시": 27,
    "인천광역시": 28,
    "광주광역시": 29,
    "대전광역시": 30,
    "울산광역시": 31,
    "세종특별자치시": 36,
    "경기도": 41,
    "강원도": 42,
    "충청북도": 43,
    "충청남도": 44,
    "전라북도": 45,
    "전라남도": 46,
    "경상북도": 47,
    "경상남도": 48,
    "제주특별자치도": 50
};

const LongTrip = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest');
  const [userId, setUserId] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState({ place: '' });
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCity, setSelectedCity] = useState(''); // 도시 선택을 위한 state 추가
  const location = useLocation();
  const { gender, ageGroup } = location.state || {}; // 전달된 state에서 gender와 ageGroup 가져오기

  const reasonRef = useRef(null);
  const transportRef = useRef(null);
  const preferencesRef = useRef(null);
  const activityRef = useRef(null);
  const companionRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
      axios.get(process.env.REACT_APP_PROXY + '/api/user/retrieve-info', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        if(response.status === 200) {
          if(response.data.name) {
            setUserName(response.data.name);
            setUserId(response.data.id);
          } else {
            localStorage.removeItem('accessToken');
          }
        }
      })
      .catch(error => {
        console.error('로그인 정보 없음:', error);
        localStorage.removeItem('accessToken');
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      alert('날짜를 선택해주세요!');
      return;
    }
    if (!selectedReason || !selectedTransport || !Object.values(selectedPreferences).every(Boolean) || !selectedActivity || !selectedCompanion) {
      alert('모든 필드를 선택해주세요!');
      if (!selectedReason) reasonRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedTransport) transportRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedActivity) activityRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedCompanion) companionRef.current.scrollIntoView({ behavior: 'smooth' });
      else preferencesRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  
    const data = {
      residence_sgg_cd: parseInt(selectedCity, 10),
      gender: gender.slice(0, 1),
      age_grp: parseInt(ageGroup.slice(0, 2), 10),
      travel_num: 1,
      travel_motive_1: selectedReason,
      mvmn_nm: selectedTransport,
      companion_age_grp: 4.0,
      rel_cd: parseFloat(selectedCompanion)
    };
    
    try {
      // POST 요청을 보내고 비동기 응답을 대기
      const response = await axios.post(process.env.REACT_APP_PROXY + '/api/longTrip/submit', data);
      console.log('성공:', response.data);
      
      // navigate 비동기적으로 호출
      
      navigate('/longstays/recommendations', {
        state: {
            response: response.data,
            id: userId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            gender: gender,
            ageGroup: ageGroup,
            cityCode: selectedCity,
            response: response.data
        }
    });
      
    } catch (error) {
      // 오류 처리
      alert('오류 발생:', error);
      console.error('오류:', error);
    }
  }

  const handleReasonClick = (reason) => {
    setSelectedReason(selectedReason === reason ? '' : reason);
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

  const handleActivityClick = (activity) => {
    setSelectedActivity(selectedActivity === activity ? '' : activity);
  };

  const handleCompanionClick = (companion) => {
    setSelectedCompanion(selectedCompanion === companion ? '' : companion);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    setStartDate(update[0]);
    setEndDate(update[1]);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value); // 선택된 도시의 코드 저장
  };


  return (
    <div>
      <Header />
        <p id='startText'>{userName} 님이 오래 머무실 곳을 추천해드리기 전 몇가지를 알려주세요!</p>

        <div className="long-form-container">
          {/* 도시 선택 드롭다운 추가 */}
        <div className="city-dropdown">
          <p className='question'>살고 계신 지역을 알려주세요.</p>
          <select id="city" value={selectedCity} onChange={handleCityChange}>
            <option value="">도시를 선택해주세요</option>
            {Object.entries(cities).map(([city, code]) => (
              <option key={code} value={code}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div ref={reasonRef}>
          <p className='question'>오랜 여행을 결심하게 된 이유가 있나요?</p>
          <div className="long-button-group">
            {reasons.map((reason, index) => (
              <button
                key={reason}
                value={index + 1}
                onClick={() => handleReasonClick(index + 1)}
                className={selectedReason === (index + 1) ? 'selected' : ''}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
        <div ref={transportRef}>
          <p className='question'>이동수단을 선택해주세요.</p>
          <div className="long-button-group">
          {transports.map((transport, index) => (
            <button
              key={transport} // key로 transport 사용
              value={transportsValue[index]} // transportsValue 배열에서 해당 인덱스의 값 사용
              onClick={() => handleTransportClick(transportsValue[index])} // 클릭 시 transportsValue 값을 설정
              className={selectedTransport === transportsValue[index] ? 'selected' : ''}
            >
              {transport} {/* 버튼에 표시할 텍스트는 transport */}
            </button>
          ))}
        </div>
        </div>
        <div ref={preferencesRef}>
          <p className='question'>선호하는 장소 타입</p>
          <PreferenceSelector
            category="place"
            leftLabel="실내"
            rightLabel="실외"
            selectedValue={selectedPreferences.place}
            onClick={handlePreferenceClick}
          />
        </div>
        <div ref={activityRef}>
          <p className='question'>머무시는 동안 어떤 활동을 하고 싶은가요?</p>
          <div className="long-grid-button-group">
            {activities.map((activity) => (
              <button
                key={activity}
                onClick={() => handleActivityClick(activity)}
                className={selectedActivity === activity ? 'selected' : ''}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>
        <div ref={companionRef}>
          <p className='question'>동행인이 있으면 선택해주세요.</p>
          <div className="long-grid-button-group">
            {togethers.map((together, index) => (
              <button
                key={together}
                value={index + 1}
                onClick={() => handleCompanionClick(index + 1)}
                className={selectedCompanion === (index + 1) ? 'selected' : ''}
              >
                {together}
              </button>
            ))}
          </div>
        </div>
        {/* 달력 */}
        <div className='calendar'>
            <p className='question'>여행 날짜를 선택해주세요.</p>
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
      </div>
      <button onClick={handleSubmit} className="submit-button">선택 완료</button>
    </div>
  );
};

export default LongTrip;