import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import basic_profile from "../images/profile.png";
import "../styles/header.css"

const Header = () => {
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetch(process.env.REACT_APP_PROXY + '/api/user/retrieve-info', {
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
        <img className="logo" src={logo} alt="Logo" />
      </a>
      <nav>
          <ul>
            <li><a href="#how-to-use">이용 방법</a></li>
            <li><a href="/longTrip">장기 여행지 추천</a></li>
            <li><a href="/short-term">단기 일정 추천</a></li>
            <li><a href="/myTravel">내 여행</a></li>
            <li><a href="#support">고객 지원</a></li>
          </ul>
        </nav>
        {userImage ? (
          <a className="profile" href="/profile">
            <img src={userImage} alt={userImage} className="profile-image" />
          </a>
        ) : (
          <a className="profile" href="/login"><img src={basic_profile} alt={basic_profile} id='basic_profile'/></a>
        )}
    </header>
  );
};

export default Header;