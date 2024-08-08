// src/views/long_trip.js

import React from 'react';
import Header from '../components/Header';

import { reasons, transports, locationTypes, activities, togethers } from '../data/long_trip_data';

const LongTrip = () => {
    


    return (
        <div>
            <Header />
            <h1>Bami 님이 오래 머무실 곳을 추천해드리기 전 몇가지를 알려주세요!</h1>

            {/* <div className='section'>

            </div>     */}
            <section>
                <h2>오랜 여행을 결심하게 된 이유가 있나요?</h2>
                <div className='options'>
                    {reasons.map((reason, index) => (
                        <button key={index}>{reason}</button>
                    ))}
                </div>
            </section>

            <section>
                <h2>이동수단을 선택해주세요.</h2>
                <div className='options'>
                    {transports.map((transport, index) => (
                        <button key={index}>{transport}</button>
                    ))}
                </div>
            </section>

            <section>
                <h2>선호하는 장소 타입</h2>
                <div className='preferred-location-type'>
                    <span>실내</span>
                    {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                        <button key={level}></button>
                    ))}
                    <span>실외</span>
                </div>
            </section>

            <section>
                <h2>머무시는 동안 어떤 활동을 하고 싶은가요?</h2>
                <div className='options'>
                    {activities.map((map, index) => (
                        <button key={index}>{map}</button>
                    ))}
                </div>
            </section>

            <section>
                <h2>동행인이 있으면 선택해주세요.</h2>
                <div className='options'>
                    {togethers.map((together, index) => (
                        <button key={index}>{together}</button>
                    ))}
                </div>
            </section>

            <section>
                <h2>여행 날짜를 선택해주세요.</h2>
                <div className='calendar'>
                    <div>2024년 1월</div>
                    <table>
                        <thead>
                            <tr>
                                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {[...Array(31).keys()].map((date, index) => (
                                    <td key={index}>{date + 1}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <button className='submit-button'>선택완료</button>
        </div>
    );
};

export default LongTrip;