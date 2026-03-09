import React, { useState } from 'react';

function Header({ setView }) {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => setMenuActive(!menuActive);
    const closeMenu = () => setMenuActive(false);

    const handleAllCardsClick = (e) => {
        e.preventDefault();
        closeMenu();
        setView('all-cards');
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
        setView('home');
    };

    return (
        <header className="fixed-header">
            <div className="header-content">
                <div className="logo-section">
                    <img src="/logo.png" style={{ width: '48px', height: '48px' }} alt="Logo" />
                    <div className="site-name">UMP</div>
                </div>
                <button
                    className={`menu-toggle ${menuActive ? 'active' : ''}`}
                    id="menuToggle"
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`nav-menu ${menuActive ? 'active' : ''}`} id="navMenu">
                    <a href="#" id="homeLink" onClick={handleHomeClick}>Home</a>
                    <a href="#" id="allCardsLink" onClick={handleAllCardsClick}>All Cards</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
