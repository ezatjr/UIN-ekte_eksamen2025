import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Menu, X, Ticket } from 'lucide-react';

const Header: React.FC = () => {
  const { isLoggedIn } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <Ticket size={24} />
          <span>Billettlyst</span>
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav>
          <ul className={`nav-list ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <li>
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Hjem
              </Link>
            </li>
            <li>
              <Link 
                to="/category/music" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Musikk
              </Link>
            </li>
            <li>
              <Link 
                to="/category/sports" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sport
              </Link>
            </li>
            <li>
              <Link 
                to="/category/theater" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Teater
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isLoggedIn ? 'Min Side' : 'Logg inn'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;