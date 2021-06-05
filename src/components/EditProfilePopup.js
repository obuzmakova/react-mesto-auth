import React from 'react';
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm title="Редактировать профиль" name="profile" submitBtn="Сохранить"
                       isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
            <div className="popup__rows">
                <input type="text" value={name || ''} onChange={handleChangeName} placeholder="Имя"
                       className="popup__text popup__text_type_name" id="title" minLength="2" maxLength="40" required/>
                       <span className="popup__text-error title-error"></span>
                <input type="text" value={description || ''} onChange={handleChangeDescription} placeholder="Вид деятельности"
                       className="popup__text popup__text_type_occupation" id="occupation" minLength="2" maxLength="200" required/>
                       <span className="popup__text-error occupation-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default EditProfilePopup;