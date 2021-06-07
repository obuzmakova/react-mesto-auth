import React from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleChangeName(e) {
        setName(e.target.value);
    }
    function handleChangeLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onAddCard({
            name: name,
            link: link,
        });
        setName('');
        setLink('');
    }

    return (
        <PopupWithForm title="Новое место" name="card" submitBtn="Сохранить" isOpen={props.isOpen}
                       onClose={props.onClose} onSubmit={handleSubmit}>
            <div className="popup__rows">
                <input type="text" value={name} onChange={handleChangeName} placeholder="Название"
                       className="popup__text popup__text_type_place" id="name" minLength="2" maxLength="30" required/>
                <span className="popup__text-error name-error"></span>
                <input type="url" value={link} onChange={handleChangeLink} placeholder="Ссылка на картинку"
                       className="popup__text popup__text_type_link" id="link" required/>
                <span className="popup__text-error link-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default AddPlacePopup;