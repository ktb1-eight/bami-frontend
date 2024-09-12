import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { convert as romanize } from 'hangul-romanization';
import '../styles/longRecommendationResult.css';
import CityModal from '../components/CityModal';
import ConfirmModal from '../components/ConfirmModal';

const fetchImages = async (query) => {
    try {
        const response = await axios.get(process.env.REACT_APP_PROXY + `/api/longstay/city-image/${query}`);
        const data = response.data;
        return data && data.items ? data.items.map(item => item.link) : [];
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

const fetchDescription = async (cityName) => {
    try {
        const response = await axios.get(process.env.REACT_APP_PROXY + `/api/longstay/city-description/${cityName}`);
        return response.data;
    } catch (e) {
        console.error("Error fetching city description:", e);
        return "설명을 불러오는 중 오류가 발생했습니다.";
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const removeCitySuffix = (cityName) => {
    return cityName
        .replace('특별자치도', '')
        .replace('특별시', '')
        .replace('광역시', '')
        .replace('시', '')
        .replace('군', '')
        .replace('구', '');
};

const LongRecommendationResult = () => {
    const [cities, setCities] = useState([]);
    const [modalOepn, setModalOpen] = useState(false);
    const [confirmModalOepn, setConfirmModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null); 
    // const [aiResponse, setAiResponse] = useState([]); 

    const location = useLocation();

    // location.state를 통해 데이터 받아오기
    const { id, startDate, endDate, gender, ageGroup, cityCode, response } = location.state || {};

    // useEffect(() => {
    //     // response가 있는 경우 처리
    //     if (response) {
    //         setAiResponse(response.split(',')); // ','로 나눠서 배열로 변환
    //     }
    // }, [response]);

    const getCityNames = () => {
        // aiResponse가 null이거나 배열이 비어있으면 기본값 반환
        if (!response || response.length === 0) {
            return [
                { name: '서울특별시' },
                { name: '제주특별자치도' },
                { name: '수원' },
                { name: '대구광역시' },
                { name: '대관령' },
                { name: '부산광역시' },
                { name: '보성군' },
                { name: '속초시' },
            ];
        } else {
            const cityNames = [];
            for (let i = 0; i < 8; i++) {
                const city = response[i];
                const cityName = city.split(' ')[1]; 
                console.log("cityName: ",cityName);

                cityNames.push({ name: cityName });
            }
            return cityNames;
        }
    };

    useEffect(() => {
        const cityNames = getCityNames();
        const fetchCity = async () => {
            const updatedCities = await Promise.all(cityNames.map(async (city) => {
                try {
                    const imageUrls = await fetchImages(city.name + " 풍경");
                    const displayName = removeCitySuffix(city.name);
                    const englishName = capitalizeFirstLetter(romanize(displayName));
                    const description = await fetchDescription(city.name);
                    return { ...city, displayName, englishName, description, imageUrls, currentImageIndex: 0 };
                } catch (error) {
                    console.error(`Error fetching images for ${city.name}`, error);
                    return { ...city, displayName: removeCitySuffix(city.name), englishName: capitalizeFirstLetter(romanize(removeCitySuffix(city.name))), description: "", imageUrls: [], currentImageIndex: 0 };
                }
            }));
            setCities(updatedCities);
        };

        fetchCity();
    }, [response]);

    const handleImageError = (cityIndex) => {
        setCities(prevCities => {
            const newCities = [...prevCities];
            const city = newCities[cityIndex];
            if (city.currentImageIndex < city.imageUrls.length - 1) {
                city.currentImageIndex += 1;
            }
            return newCities;
        });
    };

    const openModal = (city) => {
        setSelectedCity(city);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const selectCity = async (city) => {
        if (id) {
            try {
                const response = await axios.post("/api/longstay/save-schedule", {
                    'user': { 'id': id },
                    'location': city.name,
                    'startDate': startDate,
                    'endDate': endDate,
                    'visited': false,
                });
                console.log("DB 저장 성공:", response.data);
            } catch (error) {
                console.error("DB 저장 실패:", error);
            }
        }
        setModalOpen(false);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setSelectedCity(null);
    }

    return (
        <div className="result-container">
            <Header />
            <p id='headline1'>알려주신 내용을 바탕으로 추천하는 한달 살이 여행지입니다.</p>
            <p id='headline2'>이미지 위로 커서를 올리면 정보를 알 수 있어요</p>
            <ul className="grid">
                {cities.map((city, index) => (
                    <li key={index} onClick={() => openModal(city)}>
                        {city.imageUrls.length > 0 ? (
                            <img
                                src={city.imageUrls[city.currentImageIndex]}
                                alt={city.name}
                                onError={() => handleImageError(index)}
                            />
                        ) : (
                            <p>이미지를 불러올 수 없습니다.</p>
                        )}
                        <p id='englishName'>{city.englishName}</p>
                        <p id='koreanName'>{city.displayName}</p>
                    </li>
                ))}
            </ul>

            <CityModal isOpen={modalOepn} onClose={closeModal} selectCity={selectCity} city={selectedCity} />
            {confirmModalOepn && <ConfirmModal isOpen={confirmModalOepn} onClose={closeConfirmModal} cityName={selectedCity.displayName} ageGroup={ageGroup} gender={gender} />}
        </div>
    );
};

export default LongRecommendationResult;
