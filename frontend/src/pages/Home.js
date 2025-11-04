import React from 'react';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem 3rem',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(60, 60, 120, 0.15)',
        textAlign: 'center',
        maxWidth: '420px',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          marginBottom: '1rem',
          color: '#2d3a4a',
          letterSpacing: '1px',
        }}>🛩 Website Builder</h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5a6a',
          marginBottom: '2rem',
        }}>
          Select a template, enter your content, and get your complete static website instantly!
        </p>
        <button
          onClick={() => navigate('/create')}
          style={{
            background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.8rem 2.2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Start Creating Your Website
        </button>
      </div>
    </div>
  );
}

export default Home;