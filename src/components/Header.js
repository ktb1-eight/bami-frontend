// src/components/Header.js

import React from 'react';
import image from '../images/image.png';
import "../styles/header.css"

const Header = () => {
  return (
    <header>
      <img className="logo" src={image} alt="Logo" /> 
      <nav>
          <ul>
            <li><a href="#how-to-use">이용 방법</a></li>
            <li><a href="#long-term">장기 여행지 추천</a></li>
            <li><a href="#short-term">단기 일정 추천</a></li>
            <li><a href="#my-travel">내 여행</a></li>
            <li><a href="#support">고객 지원</a></li>
          </ul>
        </nav>
        <div className="profile">Profile</div>
    </header>
  );
};

export default Header;