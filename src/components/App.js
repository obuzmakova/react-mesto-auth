import React, {useState, useEffect} from 'react';
import Header from './Header';
import Main from './Main';
import PopupWithForm from "./PopupWithForm";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import api from '../utils/api';
import { Route, Switch, Redirect } from 'react-router-dom';
import {CardsContext} from "../contexts/CardsContext";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import Footer from "./Footer";

function App() {
    const [cards, setCards] = useState([]);
    const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
    const [selectedCard, setSelect] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = React.useState({
        username: '',
        email: ''
    })

    function closeAllPopups() {
        setAvatarPopupOpen(false);
        setProfilePopupOpen(false);
        setPlacePopupOpen(false);
        setSelect(null);
    }

    function handleCardClick(card) {
        setSelect(card);
    }

    function handleAvatarPopupOpen() {
        setAvatarPopupOpen(true);
    }

    function handleProfilePopupOpen() {
        setProfilePopupOpen(true);
    }

    function handlePlacePopupOpen() {
        setPlacePopupOpen(true);
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleCardDelete(card) {
        const isDeleted = card._id;

        api.deleteCard(card._id)
            .then((deletedCard) => {
                const newCards = cards.filter(function(card) {
                    return card._id !== isDeleted;
                });
                setCards(newCards);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateUser({name, about}) {
        api.updateUserInfo(name, about)
            .then((info) => {
                setCurrentUser(info);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateAvatar(avatar) {
        api.addNewAvatar(avatar)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleAddPlaceSubmit({name, link}) {
        api.addNewCard(name, link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([info, cards]) => {
                setCurrentUser(info);
                setCards(cards);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <CardsContext.Provider value={cards}>
                <div className="page">
                    <div className="content">
                        <Header />
                        {/*{loggedIn && <HeaderLogged/>}*/}
                        <Switch>
                            <Route path="/sign-up">

                            </Route>

                            <Route path="/sign-in">

                            </Route>

                            <Route exact path="/">
                                {loggedIn ? <Redirect to="/content" /> : <Redirect to="/sign-in" />}
                            </Route>

                            <ProtectedRoute
                                path="/content"
                                loggedIn={loggedIn}
                                component={Main}
                                cards={cards}
                                onCardClick={handleCardClick}
                                onEditAvatar={handleAvatarPopupOpen}
                                onEditProfile={handleProfilePopupOpen}
                                onAddPlace={handlePlacePopupOpen}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                            />
                        </Switch>

                        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddPlaceSubmit}/>
                        <PopupWithForm title="Вы уверены?" name="question" submitBtn="Да" onClose={closeAllPopups}> </PopupWithForm>
                        <ImagePopup image={selectedCard} onClose={closeAllPopups}/>

                        <Footer />
                    </div>
                </div>
            </CardsContext.Provider>
        </CurrentUserContext.Provider>
  );
}

export default App;
