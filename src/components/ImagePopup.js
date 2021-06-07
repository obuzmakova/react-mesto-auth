import React from 'react';

function ImagePopup({image, onClose}) {
    return (
        <div className={`popup popup_type_img ${image ? `popup_opened` : ""}`}>
            <div className="popup__container">
                <button type="button" className="popup__close-button" onClick={onClose}/>
                <img className="popup__image" src={`${image?.link}`} alt={image?.name}/>
                <h3 className="popup__name-place">{image?.name}</h3>
            </div>
        </div>
    )
}

export default ImagePopup;