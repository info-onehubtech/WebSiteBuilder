import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;
const BACKEND_BASE_URL = API_BASE_URL; // Needed to construct the direct preview link

function PreviewPublish() {
  const { id } = useParams();
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the data or the URL for the static preview
    const fetchPreviewUrl = async () => {
      try {
        const response = await axios.get(`${API_URL}/preview/${id}`);
        setPreviewUrl(response.data.previewURL);
      } catch (error) {
        console.error('Error fetching preview URL:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreviewUrl();
  }, [id]);

  const handleDownload = () => {
    // Triggers the download route
    window.location.href = `${API_URL}/download/${id}`;
  };

  if (loading) {
    return <h2>Loading Preview Details...</h2>;
  }
  
  if (!previewUrl) {
    return <h2>Error: Could not find generated site.</h2>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem 2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(60, 60, 120, 0.15)',
        width: '100%',
        maxWidth: '540px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2d3a4a',
          marginBottom: '0.5rem',
        }}>🎉 Website Generated Successfully!</h2>

        <h3 style={{ color: '#4a5a6a', marginBottom: '0.2rem' }}>1. Live Preview</h3>
        <p style={{ fontSize: '1rem', color: '#191654', marginBottom: '0.5rem' }}>
          Your site is live at: <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6a82fb', fontWeight: 'bold' }}>{previewUrl}</a>
        </p>
        <div style={{
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)',
          border: '1px solid #e0eafc',
          marginBottom: '1rem',
        }}>
          <iframe
            src={previewUrl}
            title="Website Preview"
            width="100%"
            height="400px"
            style={{ border: 'none', width: '100%' }}
          ></iframe>
        </div>

        <h3 style={{ color: '#4a5a6a', marginBottom: '0.2rem' }}>2. Download Static Files</h3>
        <button
          onClick={handleDownload}
          style={{
            background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
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
          Download ZIP File (HTML/CSS/Images)
        </button>
        {/* Bonus: Add a "Publish" button here for future hosting integration */}
      </div>
    </div>
  );
}

export default PreviewPublish;