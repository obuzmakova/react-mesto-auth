import React from 'react';
import headerLogo from '../images/header-logo.svg';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <div className="header">
            <img className="header__logo" alt="Название ресурса Место. Россия" src={headerLogo}/>
            <div className="header__auth-info">
                {props.handleLogout ? <p className="header__email">{props.userData.email}</p> : null}
                {props.handleLogout ? <button onClick={props.handleLogout} className="header__link">{props.text}</button> :
                    <Link to={props.direction} className="header__link">{props.text}</Link>}
            </div>
        </div>
    )
}

export default Header;