import React from 'react';

function InfoTooltip(props) {

    return (
        <div className={`popup ${props.isOpen ? `popup_opened` : ""}`}>
            <div className="popup__container popup__container_type_tooltip">
                <button type="button" className="popup__close-button" onClick={props.onClose}/>
                <img className="tooltip__image" src={props.statusLogo} alt={props.statusLogoAlt}/>
                <p className="tooltip__text">{props.statusText}</p>
            </div>
        </div>
    )
}

export default InfoTooltip;