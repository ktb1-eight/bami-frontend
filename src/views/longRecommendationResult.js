import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { convert as romanize } from 'hangul-romanization'; // 'convert' 함수를 'romanize'로 사용
import '../styles/longRecommendationResult.css';

const fetchImages = async (query) => {
    try {
        const response = await axios.get(`/api/city-image/${query}`);
        const data = response.data;
        return data && data.items ? data.items.map(item => item.link) : []; // 모든 이미지 URL을 배열로 반환
    } catch (error) {
        console.error('Error fetching images:', error);
        return []; // 에러 발생 시 빈 배열 반환
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const LongRecommendationResult = () => {
    const [cities, setCities] = useState([]);

    const getCityNames = () => {
        return [
            { name: '서울특별시' },
            { name: '제주' },
            { name: '수원' },
            { name: '대구광역시' },
            { name: '대관령' },
            { name: '부산' },
            { name: '보성군' },
            { name: '속초시' },
        ];
    };

    const removeCitySuffix = (cityName) => {
        return cityName
            .replace('특별시', '')
            .replace('광역시', '')
            .replace('시', '')
            .replace('군', '');
    };

    useEffect(() => {
        const cityNames = getCityNames();

        const fetchCityImages = async () => {
            const updatedCities = await Promise.all(cityNames.map(async (city) => {
                try {
                    const imageUrls = await fetchImages(city.name + " 풍경"); // 이미지 URL 배열 가져오기
                    const displayName = removeCitySuffix(city.name); // 화면에 표시할 때의 이름 변환
                    const englishName = capitalizeFirstLetter(romanize(displayName)); // 한글 이름을 로마자로 변환
                    return { ...city, name: displayName, englishName, imageUrls, currentImageIndex: 0 }; // 변환된 이름 사용
                } catch (error) {
                    console.error(`Error fetching images for ${city.name}`, error);
                    return { ...city, name: removeCitySuffix(city.name), englishName: capitalizeFirstLetter(romanize(removeCitySuffix(city.name))), imageUrls: [], currentImageIndex: 0 };
                }
            }));
            setCities(updatedCities);
        };

        fetchCityImages();
    }, []);

    const handleImageError = (cityIndex) => {
        setCities(prevCities => {
            const newCities = [...prevCities];
            const city = newCities[cityIndex];
            if (city.currentImageIndex < city.imageUrls.length - 1) {
                city.currentImageIndex += 1; // 다음 이미지로 인덱스 증가
            }
            return newCities;
        });
    };

    return (
        <div className="container">
            <Header />
            <p id='headline1'>알려주신 내용을 바탕으로 추천하는 한달 살이 여행지입니다.</p>
            <p id='headline2'>이미지 위로 커서를 올리면 정보를 알 수 있어요</p>
            <ul className="grid">
                {cities.map((city, index) => (
                    <li key={index}>
                        {city.imageUrls.length > 0 ? (
                            <img
                                src={city.imageUrls[city.currentImageIndex]}
                                alt={city.name}
                                onError={() => handleImageError(index)} // 이미지 로드 실패 시 다음 이미지로
                            />
                        ) : (
                            <p>이미지를 불러올 수 없습니다.</p>
                        )}
                        <p id='englishName'>{city.englishName}</p>
                        <p id='koreanName'>{city.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LongRecommendationResult;
