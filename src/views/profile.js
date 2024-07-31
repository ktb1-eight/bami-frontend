import React, { useEffect, useState } from 'react';
import '../styles/profile.css';
import Header from '../components/Header';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch('/api/user-info', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then (response => {
                if(response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Invalid token');
                }
            })
            .then (data => {
                setUserInfo(data);
            })
            .catch(error => {
                console.error('Error fetching user info: ', error);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            })
        } else {
            window.location.href = "/login";
        }
    }, []);

    if(!userInfo) {
        return <div>로딩중</div>;
    }

    return (
        <div>
            <Header />
            <div id='container'>
                <img src={userInfo.image} alt={`${userInfo.name}'s profile`} id='profile_image'/>
                <p id='profile_name'>{userInfo.name}</p>
                <p id='profile_setting'>프로필 설정</p>
                <div className='input-group'>
                    <p className='description'>닉네임</p>
                    <input type="text" value={userInfo.name} id='input_name'/>
                </div>
                <div className='input-group'>
                    <p className='description'>이메일</p>
                    <input type="text" value={userInfo.email} readOnly disabled id='input_email' />
                </div>
                <button id='delete_account'>회원탈퇴</button>
                <div id='button_group'>
                    <button id='go_back'>로그아웃</button>
                    <button id='save'>저장</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
