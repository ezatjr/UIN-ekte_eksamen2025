import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Billettlyst</h3>
          <p>
            Din destinasjon for billetter til de beste arrangementene. Finn konserter, sport,
            teaterforestillinger og mer.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="#" className="footer-link">
              <Instagram size={20} />
            </a>
            <a href="#" className="footer-link">
              <Facebook size={20} />
            </a>
            <a href="#" className="footer-link">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Kategorier</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <Link to="/category/music" className="footer-link">Musikk</Link>
            </li>
            <li>
              <Link to="/category/sports" className="footer-link">Sport</Link>
            </li>
            <li>
              <Link to="/category/theater" className="footer-link">Teater & Show</Link>
            </li>
            <li>
              <Link to="/category/family" className="footer-link">Familie</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Hjelp</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <a href="#" className="footer-link">Kundeservice</a>
            </li>
            <li>
              <a href="#" className="footer-link">Ofte stilte spørsmål</a>
            </li>
            <li>
              <a href="#" className="footer-link">Billettvilkår</a>
            </li>
            <li>
              <a href="#" className="footer-link">Personvern</a>
            </li>
            <li>
              <a 
                href="https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
              >
                Ticketmaster Discovery API
              </a>
            </li>
          </ul>

        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; 2025 Billettlyst. Alle rettigheter reservert.</p>
      </div>
    </footer>
  );
};

export default Footer;