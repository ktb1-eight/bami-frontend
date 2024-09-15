import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const KakaoMapWithDirections = ({ recommendations }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polyline, setPolyline] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!window.kakao || recommendations.length < 2) return;

    const center = new window.kakao.maps.LatLng(recommendations[0].latitude, recommendations[0].longitude);
    const options = {
      center: center,
      level: 3
    };

    const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(kakaoMap);

    displayMarkers(kakaoMap);
    fetchDirections();
  };

  const displayMarkers = (map) => {
    const newMarkers = recommendations.map((place, index) => {
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: map
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${place.name}</div>`
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

      return marker;
    });

    setMarkers(newMarkers);
  };

  const fetchDirections = async () => {
    try {
      const origin = `${recommendations[0].longitude},${recommendations[0].latitude}`;
      const destination = `${recommendations[recommendations.length - 1].longitude},${recommendations[recommendations.length - 1].latitude}`;
      const waypoints = recommendations.slice(1, -1)
        .map(place => `${place.longitude},${place.latitude}`)
        .join('|');

      console.log('요청 세부 정보:', {
        url: 'https://apis-navi.kakaomobility.com/v1/directions',
        params: { origin, destination, waypoints, priority: 'RECOMMEND' },
        headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY.substring(0, 5)}...` }
      });

      const response = await axios.get('https://apis-navi.kakaomobility.com/v1/directions', {
        params: {
          origin,
          destination,
          waypoints,
          priority: 'RECOMMEND'
        },
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`
        }
      });

    } catch (error) {
      console.error('경로 가져오기 오류:', error);
      console.error('오류 응답:', error.response);
      if (error.response && error.response.status === 401) {
        setError('API 키 인증에 실패했습니다. 관리자에게 문의하세요.');
      } else {
        setError(`경로를 가져오는 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };
  

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default KakaoMapWithDirections;