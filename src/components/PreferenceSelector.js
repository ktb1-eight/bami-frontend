import React from 'react';

const PreferenceSelector = ({ category, leftLabel, rightLabel, selectedValue, onClick }) => {
    return (
        <div className="preference">
            <span className="left-name">{leftLabel}</span>
            {['1', '2', '3', '4', '5', '6', '7'].map((value, index) => (
                <button
                    key={value}
                    onClick={() => onClick(category, value)}
                    className={`${selectedValue === value ? 'selected' : ''} size-${index + 1}`}
                />
            ))}
            <span className="right-name">{rightLabel}</span>
        </div>
    );
};

export default PreferenceSelector;