// src/components/Header.js

import React, { useState, useEffect } from 'react';
import image from '../images/image.png';
import "../styles/header.css"

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetch('/api/user-info', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        if(response.status === 200) {
          return response.json();
        } else {
          throw new Error('Invalid token');
        }
      })
      .then(data => {
        if(data.name) {
          setUserName(data.name);
          setUserImage(data.image);
        } else {
          localStorage.removeItem('accessToken');
          // window.location.href = '/login';
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      });
    }
  }, []);

  return (
    <header>
      <a href="/">
        <img className="logo" src={image} alt="Logo" />
      </a>
      <nav>
          <ul>
            <li><a href="#how-to-use">이용 방법</a></li>
            <li><a href="#long-term">장기 여행지 추천</a></li>
            <li><a href="#short-term">단기 일정 추천</a></li>
            <li><a href="#my-travel">내 여행</a></li>
            <li><a href="#support">고객 지원</a></li>
          </ul>
        </nav>
        {userImage ? (
          <a className="profile" href="/profile">
            <img src={userImage} alt={userName} className="profile-image" />
          </a>
        ) : (
          <a className="profile" href="/login">로그인</a>
        )}
    </header>
  );
};

export default Header;