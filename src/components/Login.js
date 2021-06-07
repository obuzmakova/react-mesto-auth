import React, {useState} from 'react';

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
        const {email, password} = data;
        props.handleLogin({email, password});
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
                <button type="submit" className="register__button register__button-signin">Войти</button>
            </form>
        </div>
    )
}

export default Login;