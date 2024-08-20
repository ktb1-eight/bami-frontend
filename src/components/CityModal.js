import React from 'react';
import '../styles/cityModal.css';


const CityModal = ({ city, isOpen, onClose }) => {
    
    if(!isOpen || !city) {
        return null;
    }
    const capitalizeAll = (string) => {
        let newStr = '';
        for(let i = 0; i < string.length; i++) {
            newStr += string.charAt(i).toUpperCase();
        }
        return newStr;
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            {/* 예를 들어, 모달 창이 열렸을 때, 모달 창 바깥을 클릭하면 모달이 닫히게 하고 싶을 때가 있습니다. 하지만 모달 창 안쪽의 내용을 클릭했을 때는 모달이 닫히지 않아야 하겠죠. */}
            <div className='modal-content' onClick={(e) => e.stopPropagation()}> 
                <div id='row'>
                    <div id='column'>
                        <p id='englishName'>{capitalizeAll(city.englishName)}</p>
                        <p id='name'>{city.displayName}</p>
                        <p id='description'>{city.description}</p>
                    </div>
                    {city.imageUrls.length > 0 ? (
                        <img 
                            src={city.imageUrls[city.currentImageIndex]}
                            alt={city.name}
                            className='modal-image'
                        />
                    ) : (
                        <p>이미지를 불러올 수 없습니다.</p>
                    )} 
                </div>
                <button onClick={() => onClose(city)} className='close-modal'>선택하기</button>
            </div>
        </div>
    );
};

export default CityModal;