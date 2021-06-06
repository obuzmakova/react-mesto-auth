import React from 'react';
import Card from './Card';
import {CurrentUserContext}from '../contexts/CurrentUserContext';

function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <div className="content">
            <section className="profile">
                <div className="profile__avatar">
                    <img className="profile__image" src={currentUser.avatar} alt="Жак-Ив Кусто"/>
                    <div className="profile__pen" onClick={props.onEditAvatar}/>
                </div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <button type="button" onClick={props.onEditProfile} className="profile__edit-button"/>
                    <p className="profile__subtitle">{currentUser.about}</p>
                </div>
                <button type="button" onClick={props.onAddPlace} className="profile__add-button"/>
            </section>
            <div className="elements">
                {props.cards.map((card) => (<Card key={card._id} card={card} onClick={props.onCardClick} onCardLike={props.onCardLike}
                                            onCardDelete={props.onCardDelete}/>))}
            </div>
        </div>
    )
}

export default Main;