import React from 'react';
import {CurrentUserContext}from '../contexts/CurrentUserContext';

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = props.card.owner._id === currentUser._id;

    const cardDeleteButtonClassName = (
        `element__trash ${!isOwn ? 'element__trash_hidden' : 'element__trash'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (
        `element__like ${isLiked ? 'element__like_active' : 'element__like'}`
    );

    function handleClick() {
        props.onClick(props.card);
    }

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    return (
        <div className="element">
            <img className="element__photo" src={props.card.link} onClick={handleClick} alt={props.card.name}/>
            <h3 className="element__title">{props.card.name}</h3>
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
            <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}/>
            <p className="element__counter">{props.card.likes.length}</p>
        </div>
    )
}

export default Card;