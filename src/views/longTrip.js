import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/long_trip.css';
import '../styles/calendar.css';
import Header from '../components/Header';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';


import PreferenceSelector from '../components/PreferenceSelector';
import { reasons, transports, activities, togethers } from '../data/long_trip_data';
import 'react-datepicker/dist/react-datepicker.css';

const LongTrip = () => {
  const [userName, setUserName] = useState('Guest');
  const [userId, setUserId] = useState('');
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState({ place: '' });
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

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

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert('날짜를 선택해주세요!');
      return;
    }
    if (!selectedReasons.length || !selectedTransport || !Object.values(selectedPreferences).every(Boolean) || !selectedActivity || !selectedCompanion) {
      alert('모든 필드를 선택해주세요!');
      if (!selectedReasons.length) reasonRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedTransport) transportRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedActivity) activityRef.current.scrollIntoView({ behavior: 'smooth' });
      else if (!selectedCompanion) companionRef.current.scrollIntoView({ behavior: 'smooth' });
      else preferencesRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  
    const data = {
        reason: selectedReasons,
        transport: selectedTransport,
        preferences: selectedPreferences,
        activity: selectedActivity,
        companion: selectedCompanion,
        travelDate: [startDate, endDate]
    };

    const queryParams = new URLSearchParams({
      id: userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }).toString();
    window.location.href = `/longstays/recommendations?${queryParams}`;
    axios.post(process.env.REACT_APP_PROXY + '/api/predict', data)
        .then(response => {
            console.log('성공:', response.data);
            window.location.href = "/"
        })
        .catch(error => {
            console.error('오류:', error);
        });
  };

  const handleReasonClick = (reason) => {
      setSelectedReasons((prev) =>
        prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
        //포함 되어 있다면 filter를 통해 해당 reason을 걸러내고, 아니면 포함시킨다.
      );
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


  return (
    <div>
      <Header />
        <p id='startText'>{userName} 님이 오래 머무실 곳을 추천해드리기 전 몇가지를 알려주세요!</p>

        <div className="long-form-container">
        <div ref={reasonRef}>
          <p className='question'>오랜 여행을 결심하게 된 이유가 있나요?</p>
          <div className="long-button-group">
            {reasons.map((reason) => (
              <button
                key={reason}
                onClick={() => handleReasonClick(reason)}
                className={selectedReasons.includes(reason) ? 'selected' : ''}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
        <div ref={transportRef}>
          <p className='question'>이동수단을 선택해주세요.</p>
          <div className="long-button-group">
            {transports.map((transport) => (
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
            {togethers.map((together) => (
              <button
                key={together}
                onClick={() => handleCompanionClick(together)}
                className={selectedCompanion === together ? 'selected' : ''}
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