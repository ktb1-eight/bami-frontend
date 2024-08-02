import React, { useEffect } from 'react';
import Header from '../components/Header';
import '../styles/login.css';
import naver from '../images/naver.png';
import google from '../images/google.png';
import kakao from '../images/kakao.png';


const Login = ({ config }) => {

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('accessToken')) {
            const accessToken = urlParams.get('accessToken');
            localStorage.setItem('accessToken', accessToken);
            // alert('AccessToken 로컬스토리지 저장');
            window.location.href = "/";
        }
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken) {
            window.location.href = "/";
        }
    }, []);

    const { googleClientId, googleRedirectUri, naverClientId, naverRedirectUri, kakaoClientId, kakaoRedirectUri } = config;

    return (
        <div className='container'>
            <Header />
            <main>
                <div className='heading'>
                    <div id='line-left'></div>
                    <span>SNS 간편 로그인</span>
                    <div id='line-right'></div>
                </div>
                <div className='loginLinks'>
                    <a href={`https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${naverRedirectUri}&state=STATE_STRING`}>
                        <img src={naver} alt='Naver Login' className='loginImage' />
                    </a>
                    <a href={`https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code`}>
                        <img src={kakao} alt="Kakao Login" className="loginImage" />
                    </a>
                    <a href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=profile%20email`}>
                        <img src={google} alt='Google Login' className='loginImage' />
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Login;