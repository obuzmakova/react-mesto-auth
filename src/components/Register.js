import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function Register({handleRegister}) {
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    function handleChange(e) {
        const {name, value} = e.target;

        setData({
            ...data,
            [name]: value
        })
    }

    function handleSubmit(e) {
        e.preventDefault();

        let {email, password} = data;
        handleRegister({email, password});
    }

    return (
        <div className="register">
            <p className="register__welcome">
                Регистрация
            </p>
            <form onSubmit={handleSubmit}>
                <div className="register__rows">
                    <input id="email" name="email" type="email" placeholder="Email" className="register__text"
                           value={data.email} onChange={handleChange} />
                    <input id="password" name="password" placeholder="Пароль" type="password" className="register__text"
                           value={data.password} onChange={handleChange} />
                </div>
                <button type="submit" onSubmit={handleSubmit} className="register__button">Зарегистрироваться</button>
            </form>

            <div className="register__signin">
                <p>Уже зарегистрированы?</p>
                <Link to="login" className="register__login-link">Войти</Link>
            </div>
        </div>
    )
}

export default Register;