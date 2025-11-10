
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const API_URL = `${API_BASE_URL}/api`;

function Editor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: '',
  templateId: '', // Will be set to first template if available
  about: '',
  services: ['Service 1', 'Service 2'],
  phone: '',
  email: '',
  socialAccounts: [{ type: 'Facebook', url: '' }],
  address: '',
  description: '',
  website: '',
  siteType: '',
  });
  // Dynamic social media accounts
  const handleSocialChange = (idx, field, value) => {
    const updated = [...formData.socialAccounts];
    updated[idx][field] = value;
    setFormData({ ...formData, socialAccounts: updated });
  };
  // Get template image URL
  const getTemplateImageUrl = (folderName) => {
    if (!folderName) return null;
    return `/templates/${folderName}/template.png`;
  };
  const addSocialInput = () => {
    setFormData({ ...formData, socialAccounts: [...formData.socialAccounts, { type: '', url: '' }] });
  };

  const removeSocialInput = (idx) => {
    const updated = formData.socialAccounts.filter((_, i) => i !== idx);
    setFormData({ ...formData, socialAccounts: updated });
  };
  const [adminTemplates, setAdminTemplates] = useState([]);
  useEffect(() => {
    // Fetch admin uploaded templates from backend
    axios.get(`${API_URL}/admin/templates`)
      .then(res => {
        setAdminTemplates(res.data.templates || []);
      })
      .catch(err => {
        setAdminTemplates([]);
      });
  }, []);

  // Filter templates by selected site type
  const filteredTemplates = formData.siteType
    ? adminTemplates.filter(t => t.siteType === formData.siteType)
    : adminTemplates;

  // Auto-select first matching template when siteType changes
  useEffect(() => {
    if (filteredTemplates.length > 0) {
      setFormData(f => ({ ...f, templateId: filteredTemplates[0].folderName }));
    } else {
      setFormData(f => ({ ...f, templateId: '' }));
    }
    // eslint-disable-next-line
  }, [formData.siteType, adminTemplates.length]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    // Limits to 5 images as per Multer config
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Generating website... this may take a moment.');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('templateId', formData.templateId);
      data.append('about', formData.about);

      // Must stringify complex objects/arrays before appending to FormData
      data.append('services', JSON.stringify(formData.services.filter(s => s.trim() !== '')));
      data.append('contact', JSON.stringify({ phone: formData.phone, email: formData.email }));

      // Append image files
      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await axios.post(`${API_URL}/create-site`, data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
      });

      setMessage(response.data.message);
      // Navigate to the preview/publish page with the new website ID
      navigate(`/publish/${response.data.websiteId}`);

    } catch (error) {
      console.error('Submission Error:', error.response ? error.response.data : error.message);
      setMessage(`Error: ${error.response ? error.response.data : 'Server error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 2rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#333',
          marginBottom: '0.5rem',
        }}>Website Builder</h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>Fill in the details below to create your website</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        
        {/* Basic Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1rem' }}>Basic Information</h3>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Website Name *
          </label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Enter website name" 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }} 
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Site Type
          </label>
          <select 
            name="siteType" 
            value={formData.siteType} 
            onChange={handleChange} 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}>
            <option value="">Select site type</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Blog">Blog</option>
            <option value="Business">Business</option>
            <option value="Personal">Personal</option>
            <option value="Event">Event</option>
            <option value="E-commerce">E-commerce</option>
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Template
          </label>
          <select 
            name="templateId" 
            value={formData.templateId} 
            onChange={handleChange} 
            style={{
              width: '50%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}>
            {filteredTemplates.length === 0 ? (
              <option value="">No templates available</option>
            ) : (
              filteredTemplates.map(t => (
                <option key={t.folderName} value={t.folderName}>{t.name || t.folderName}</option>
              ))
            )}
          </select>

          {/* Template Preview */}
          {formData.templateId && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem', 
                color: '#555', 
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Template Preview
              </label>
              <div style={{ 
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={`${API_BASE_URL}/templates/${formData.templateId}/template.png`}
                  alt="Template Preview"
                  style={{ 
                    width: '40%', 
                    height: 'auto',
                    maxHeight: '200px',
                    objectFit: 'cover', 
                    display: 'block',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f0f0f0" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Preview Available%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  color: 'white',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  Click to view full size
                </div>
              </div>
            </div>
          )}

          {/* Modal for Full Size Preview */}
          {showModal && formData.templateId && (
            <div 
              style={{
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '90vh', 
                background: 'rgba(0,0,0,0.85)', 
                zIndex: 9999,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem'
              }} 
              onClick={() => setShowModal(false)}
            >
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowModal(false); 
                }}
                style={{
                  position: 'absolute', 
                  top: '2rem', 
                 
                  background: 'white', 
                  color: '#333', 
                  border: 'none', 
                  borderRadius: '50px', 
                  padding: '0.75rem 1.5rem', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 10000,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ✕ Close
              </button>
              <img
                src={`${API_BASE_URL}/templates/${formData.templateId}/template.png`}
                alt="Template Fullscreen"
                style={{ 
                  maxWidth: '80vw', 
                  maxHeight: '80vh', 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  objectFit: 'contain'
                }}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f0f0f0" width="600" height="400"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Preview Available%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            About *
          </label>
          <textarea 
            name="about" 
            value={formData.about} 
            onChange={handleChange} 
            required 
            placeholder="Describe your website" 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              minHeight: '100px',
              marginBottom: '1rem',
              resize: 'vertical',
            }} 
          />
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1rem' }}>Contact Information</h3>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Email
          </label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="contact@example.com" 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }} 
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Phone
          </label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Phone number" 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }} 
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Address
          </label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="Business address" 
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
            }} 
          />
        </div>

        {/* Images */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1rem' }}>Images</h3>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '600' }}>
            Upload Images (Max 5)
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
            }} 
          />
          
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover', 
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading} 
          style={{
            width: '100%',
            background: loading ? '#ccc' : '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Generating...' : 'Generate Website'}
        </button>

        {message && (
          <p style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            background: '#f0f0f0', 
            borderRadius: '4px',
            color: '#333',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Editor;