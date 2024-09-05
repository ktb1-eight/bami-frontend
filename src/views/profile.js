import React, { useEffect, useState } from 'react';
import '../styles/profile.css';
import Header from '../components/Header';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    useEffect(() => {
        const fetchUserInfo = (accessToken) => {
            fetch(process.env.REACT_APP_PROXY + '/api/user/retrieve-info', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return refreshToken().then(newAccessToken => fetchUserInfo(newAccessToken));
                } else {
                    throw new Error('Invalid token');
                }
            })
            .then(data => {
                setUserInfo(data);
                setEditedName(data.name);
            })
            .catch(error => {
                console.error('Error fetching user info: ', error);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            });
        };

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetchUserInfo(accessToken);
        } else {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        if (userInfo && editedName !== userInfo.name) {
            setIsSaveEnabled(true);
        } else {
            setIsSaveEnabled(false);
        }
    }, [editedName, userInfo]);

    const refreshToken = () => {
        return fetch(process.env.REACT_APP_PROXY + '/api/user/refresh-token', {
            method: 'GET',
            credentials: 'include' // Ensure cookies are sent with the request
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Failed to refresh token');
            }
        })
        .then(data => {
            localStorage.setItem('accessToken', data.accessToken);
            return data.accessToken;
        })
        .catch(error => {
            console.error('Error refreshing token: ', error);
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        });
    };

    const handleSave = () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch('/api/user/update-info', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ name: editedName })
        })
        .then(response => {
            if (response.status === 200) {
                alert('수정되었습니다!');
                setUserInfo({ ...userInfo, name: editedName });
                setIsSaveEnabled(false); // 저장 후 버튼 비활성화
            } else {
                throw new Error('Failed to update user info');
            }
        })
        .catch(error => {
            console.error('Error updating user info: ', error);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    const handleDeleteAccount = () => {
        const accessToken = localStorage.getItem('accessToken');

        fetch(process.env.REACT_APP_PROXY + '/api/user/delete-info', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
        })
        .then(response => {
            if(response.status === 200) {
                alert('탈퇴 되었습니다.');
                localStorage.removeItem('accessToken');
                window.location.href = '/';
            } else {
                throw new Error('Failed to delete account');
            }
        })
        .catch(error => {
            console.error('Error deleting account: ', error);
        });
    };

    if (!userInfo) {
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
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        id='input_name'
                    />
                </div>
                <div className='input-group'>
                    <p className='description'>이메일</p>
                    <input type="text" value={userInfo.email} readOnly disabled id='input_email' />
                </div>
                <button id='delete_account' onClick={handleDeleteAccount}>회원탈퇴</button>
                <div id='button_group'>
                    <button id='go_back' onClick={handleLogout}>로그아웃</button>
                    <button id='save' onClick={handleSave} disabled={!isSaveEnabled}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
