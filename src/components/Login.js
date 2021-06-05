import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../auth.js';

function Login(props) {
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    function handleChange(e){
        const {name, value} = e.target;

        setData({
            ...data,
            [name]: value
        })
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!data.email || !data.password) {
            return ;
        }
        let {email, password} = data;
        console.log(email, password);
        props.handleLogin({email, password});
        // auth.authorize(data.email, data.password)
        //     .then((data) => {
        //         if (data.jwt){
        //             setData({email: '', password: ''} ,() => {
        //                 props.handleLogin();
        //                 props.history.push('/');
        //             })
        //         }
        //     })
        //     .catch(err => console.log(err));
    }

    return (
        <div className="register">
            <p className="register__welcome">
                Вход
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
                <button type="submit" onSubmit={handleSubmit} className="register__button-signin">Войти</button>
            </form>
        </div>
    )
}

export default Login;