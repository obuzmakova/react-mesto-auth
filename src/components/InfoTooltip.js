import React, {useState} from 'react';
import PopupWithForm from "./PopupWithForm";

function InfoTooltip(props) {
    return (
        <PopupWithForm name="tooltip" isOpen={props.isOpen} onClose={props.onClose}>
            <div >
                <img className="tooltip__image" src={props.image} alt={props.alt}/>
                <p className="tooltip__text">{props.text}</p>
            </div>
        </PopupWithForm>
    )
}

export default InfoTooltip;