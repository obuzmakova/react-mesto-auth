import React from 'react'
import headerLogo from '../images/header-logo.svg';

function Header() {
    return (
        <div className="header">
            <img className="header__logo" alt="Название ресурса Место. Россия" src={headerLogo}/>
        </div>
    )
}

export default Header;