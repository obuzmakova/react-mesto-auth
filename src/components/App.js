import React, {useEffect, useState} from 'react';
import Header from './Header';
import Main from './Main';
import PopupWithForm from "./PopupWithForm";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import InfoTooltip from './InfoTooltip';
import Login from "./Login";
import api from '../utils/api';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import Footer from "./Footer";
import * as auth from '../utils/auth';
import successLogo from '../images/success-logo.svg';
import failLogo from '../images/fail-logo.svg';

function App() {
    const [cards, setCards] = useState([]);
    const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
    const [isTooltipOpen, setTooltipOpen] = useState(false);
    const [statusLogo, setStatusLogo] = useState(null);
    const [statusText, setStatusText] = useState(null);
    const [selectedCard, setSelect] = useState(null);
    const [statusLogoAlt, setStatusLogoAlt] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: ''});
    const history = useHistory();

    useEffect(() => {
        checkToken();
    }, []);

   useEffect(() => {
        if (loggedIn) {
            history.push("/cards")
        }
    }, [loggedIn]);

    function closeAllPopups() {
        setAvatarPopupOpen(false);
        setProfilePopupOpen(false);
        setPlacePopupOpen(false);
        setTooltipOpen(false);
        setStatusLogo(null);
        setStatusText(null);
        setStatusLogoAlt(null);
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

    function handleRegister({email, password}) {
        auth.register(email, password)
            .then((data) => {
                handleSuccess();
                history.push("/sign-in");
            })
            .catch(handleFail)
    }

    function handleLogin({email, password}) {
        auth.authorize(email, password)
            .then((data) => {
                setUserData({email: email});
                setLoggedIn(true);
                history.push("/cards");
                localStorage.setItem('jwt', data.token);
            })
            .catch(handleFail)
    }

    function handleFail() {
        setStatusLogo(failLogo);
        setStatusText("Что-то пошло не так! Попробуйте ещё раз.");
        setStatusLogoAlt("Красный крест об ошибке");
        setTooltipOpen(true);
    }

    function handleSuccess() {
        setStatusLogo(successLogo);
        setStatusText("Вы успешно зарегистрировались!");
        setStatusLogoAlt("Галочка, подтверждающая успешную регистрацию");
        setTooltipOpen(true);
    }

    function handleLogout() {
        setUserData({
            email: '',
        });
        setLoggedIn(false);
        localStorage.removeItem('jwt');
    }

    function checkToken() {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            auth.checkToken(jwt)
                .then(data => {
                    setUserData({
                        email: data.data.email,
                    });
                    setLoggedIn(true);
                    history.push("/cards");
                })
                .catch(handleFail)
        } else {
            setLoggedIn(false);
        }
    }

    useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([info, cards]) => {
                    setCurrentUser(info);
                    setCards(cards);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [loggedIn]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
                <div className="page">
                    {loggedIn && <Header direction="/sign-up"
                                         text="Выйти"
                                         handleLogout={handleLogout}
                                         userData={userData}/>}
                        <Switch>
                            <ProtectedRoute
                                path="/cards"
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
                            <Route path="/sign-up">
                                <Header direction="/sign-in" text="Войти"/>
                                <Register handleRegister={handleRegister}/>
                            </Route>

                            <Route path="/sign-in">
                                <Header direction="/sign-up" text="Регистрация" handleFail={handleFail} handleSuccess={handleSuccess}/>
                                <Login handleLogin={handleLogin}/>
                            </Route>

                            <Route>
                                {loggedIn ? <Redirect to="/cards" /> : <Redirect to="/sign-in" />}
                            </Route>
                        </Switch>

                        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddPlaceSubmit}/>
                        <PopupWithForm title="Вы уверены?" name="question" submitBtn="Да" onClose={closeAllPopups}> </PopupWithForm>
                        <ImagePopup image={selectedCard} onClose={closeAllPopups}/>
                        <InfoTooltip isOpen={isTooltipOpen} onClose={closeAllPopups} statusLogo={statusLogo}
                                     statusText={statusText} statusLogoAlt={statusLogoAlt}/>

                        <Footer />
                </div>
        </CurrentUserContext.Provider>
  );
}

export default App;
