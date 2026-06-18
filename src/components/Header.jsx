import React from 'react';

const Header = () => {
    return (
        <header className="main-header">
            <a href="#" className="logo-container">
                BULLET<span className="logo-proof">PROOF</span>
            </a>
            <nav className="nav-links">
                <a href="#work" className="nav-item">WORK</a>
                <a href="#about" className="nav-item">ABOUT</a>
                <a href="#news" className="nav-item">NEWS</a>
            </nav>
        </header>
    );
};

export default Header;
