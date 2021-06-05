import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../auth.js';

function Register(props) {
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
        props.handleRegister({email, password});
        //     auth.register(this.state.username, this.state.password, this.state.email, this.state.calGoal).then((res) => {
        //         if(res.statusCode !== 400){
        //             this.props.history.push('/login');
        //         }
        //     })
    }

    return (
        <div className="register">
            <p className="register__welcome">
                Регистрация
            </p>
            <form onSubmit={handleSubmit}>
                <div className="register__rows">
                    <label htmlFor="email"/>
                    <input id="email" name="email" type="email" placeholder="Email" className="register__text"
                           value={data.email} onChange={handleChange} />
                    <label htmlFor="password"/>
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