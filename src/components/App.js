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
import {CardsContext} from "../contexts/CardsContext";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import Footer from "./Footer";
import * as auth from '../auth';
import successLogo from '../images/success-logo.svg';
import failLogo from '../images/fail-logo.svg';

function App() {
    const [cards, setCards] = useState([]);
    const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
    const [isFailTooltipOpen, setFailTooltipOpen] = useState(false);
    const [isSuccessTooltipOpen, setSuccessTooltipOpen] = useState(false);
    const [selectedCard, setSelect] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: ''});
    const history = useHistory();

    React.useEffect(() => {
        checkToken();
    }, []);

    React.useEffect(() => {
        if (loggedIn) {
            history.push('/')
        }
    }, [loggedIn]);

    function closeAllPopups() {
        setAvatarPopupOpen(false);
        setProfilePopupOpen(false);
        setPlacePopupOpen(false);
        setFailTooltipOpen(false);
        setSuccessTooltipOpen(false);
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

    function handleResponse(data) {
        debugger;
        const {jwt, user} = data;
        const {email} = user;

        handleSuccess();
        localStorage.setItem('jwt', jwt);
        debugger;
        setUserData({email});
        setLoggedIn(true);
    }

    function handleRegister({password, email}) {
        auth.register(password, email)
            // .then(handleSuccess)
            .then(handleResponse)
            .catch(handleFail)
    }

    function handleLogin({password, email}) {
        auth.authorize(password, email)
            .then(handleResponse)
            .catch(handleFail)
    }

    function handleFail() {
        setFailTooltipOpen(true);
    }

    function handleSuccess() {
        setSuccessTooltipOpen(true);

    }

    function handleLogout() {
        setUserData({
            email: '',
        });
        setLoggedIn(null);
        localStorage.removeItem('jwt');
    }

    function checkToken() {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            auth.checkToken(jwt)
                .then(data => {
                    setUserData(data);
                    setLoggedIn(true);
                })
                .catch(handleFail)
        } else {
            setLoggedIn(false);
        }
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
                    {loggedIn && <Header direction="/sign-up"
                                         text="Выйти"
                                         handleLogout={handleLogout}
                                         userData={userData}
                                         loggedIn={loggedIn}/>}
                        <Switch>
                            <Route path="/sign-up">
                                <Header direction="/sign-in" text="Войти"/>
                                <Register handleRegister={handleRegister} handleFail={handleFail} handleSuccess={handleSuccess}/>
                            </Route>

                            <Route path="/sign-in">
                                <Header direction="/sign-up" text="Регистрация" handleFail={handleFail} handleSuccess={handleSuccess}/>
                                <Login handleLogin={handleLogin}/>
                            </Route>

                            <Route>
                                {/*<Header direction="/sign-in" text="Выйти"/>*/}
                                {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                            </Route>

                            <ProtectedRoute
                                path="/"
                                loggedIn={loggedIn}
                                userData={userData}
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
                        <InfoTooltip isOpen={isFailTooltipOpen} onClose={closeAllPopups} image={failLogo}
                                     text="Что-то пошло не так! Попробуйте ещё раз." alt="Красный крест об ошибке"/>
                        <InfoTooltip isOpen={isSuccessTooltipOpen} onClose={closeAllPopups} image={successLogo}
                                     text="Вы успешно зарегистрировались!" alt="Галочка, подтверждающая успешную регистрацию"/>

                        <Footer />
                </div>
            </CardsContext.Provider>
        </CurrentUserContext.Provider>
  );
}

export default App;
