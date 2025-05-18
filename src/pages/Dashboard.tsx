import React, { useState } from 'react';
import { LogOut, User, Calendar, Ticket } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EventCard from '../components/EventCard';

// KILDER:
// - React useState: https://react.dev/reference/react/useState
// - Konteksthåndtering i React: https://react.dev/reference/react/useContext
// - Skjema og input-håndtering i React: https://www.w3schools.com/react/react_forms.asp

const Dashboard: React.FC = () => {
  const { isLoggedIn, login, logout, wishlist } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login();
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="container main-content">
        <div className="dashboard">
          <div className="dashboard-header">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Logg inn på din konto</h1>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" className="form-label">E-post</label>
              <input 
                type="email" 
                id="email" 
                className="form-input"
                placeholder="Skriv inn din e-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" className="form-label">Passord</label>
              <input 
                type="password" 
                id="password" 
                className="form-input"
                placeholder="Skriv inn ditt passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Logg inn
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
              Har du ikke en konto? <a href="#">Registrer deg</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container main-content">
      <div className="dashboard">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Mitt Dashboard</h1>
          <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} />
            Logg ut
          </button>
        </div>
        
        <div className="dashboard-content">
          <div>
            <div className="dashboard-section">
              <h2 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} />
                Personlig Informasjon
              </h2>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Navn:</strong> John Doe
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>E-post:</strong> {email || 'john.doe@example.com'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Medlem siden:</strong> April 2023
              </div>
              <button className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Rediger Profil
              </button>
            </div>
            
            <div className="dashboard-section">
              <h2 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} />
                Kommende Arrangementer
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p>Du har ingen kommende arrangementer.</p>
              </div>
              
              <button className="btn btn-primary">Utforsk Arrangementer</button>
            </div>
          </div>
          
          <div>
            <div className="dashboard-section">
              <h2 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={20} />
                Lagrede Arrangementer
              </h2>
              
              {wishlist.length === 0 ? (
                <p>Du har ikke lagret noen arrangementer ennå.</p>
              ) : (
                <div className="card-grid">
                  {wishlist.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Kjøpshistorikk</h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p>Du har ingen tidligere kjøp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
