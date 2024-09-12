import React from "react";
import "../styles/confirmModal.css"

const ConfirmModal = ({ isOpen, onClose, cityName, gender, ageGroup }) => {
    if(!isOpen || !cityName) {
        return null;
    }
    const queryParams = new URLSearchParams({
        gender: gender,
        ageGroup: ageGroup,
      }).toString();
    return (
        <div className="modal-overlay">
            <div id="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div id="confirm-modal-container">
                    <p id="modal-headline1">{cityName}을(를) 선택하셨군요!</p>
                    <p id="modal-headline2">머무시는 동안 짧게 다녀올 근처 여행도 계획해볼까요?</p>
                    <div id="modal-links">
                        <a href={`/short-term?longterm=true&userInfo=${queryParams}`} id="go-to-short-trip" onClick={onClose}>단기 여행 계획하러 가기</a>
                        <a href="/myTravel" id="later" onClick={onClose}>나중에 계획하기</a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ConfirmModal;