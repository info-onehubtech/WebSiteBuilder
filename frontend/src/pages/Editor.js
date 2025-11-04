
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
       
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.2rem',
        backgroundColor: 'rgba(2, 5, 43, 0.45)',

      }}>
      <div >
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.7rem',
          fontWeight: 'bold',
          letterSpacing: '0.07em',
          margin: 0,
          background: 'linear-gradient(90deg, #43c6ac 0%, #f8ffae 50%, #191654 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: '#191654',
          textShadow: '0 4px 16px rgba(60,60,120,0.18)',
          padding: '1.1rem 2.5rem',
          borderRadius: '2rem',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          boxShadow: '0 4px 24px rgba(60,60,120,0.10)',
        }}>Site Content Editor</h1>
      </div>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: '2rem',
      }}>

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '2.5rem',
          width: '100%',
          alignItems: 'start',
        }}>

          {/* Column 1: Basic Info */}
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 16px rgba(60,60,120,0.10)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <h2 style={{
              textAlign: 'left',
              color: '#191654',
              marginBottom: '0.5rem',
              fontSize: '2.2rem',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}>Site Content Editor</h2>
            <label style={{
              fontWeight: 'bold',
              color: '#0074D9',
              background: 'rgba(0,116,217,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Website Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter website name" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }} />
            <label style={{
              fontWeight: 'bold',
              color: '#FF69B4',
              background: 'rgba(255,105,180,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Site Type:</label>
            <select name="siteType" value={formData.siteType} onChange={handleChange} style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', background: '#fff', marginBottom: '0.5rem'
            }}>
              <option value="">Select site type</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Blog">Blog</option>
              <option value="Business">Business</option>
              <option value="Personal">Personal</option>
              <option value="Event">Event</option>
              
            </select>
            <label style={{
              fontWeight: 'bold',
              color: '#2ECC40',
              background: 'rgba(46,204,64,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>About Content:</label>
            <textarea name="about" value={formData.about} onChange={handleChange} required placeholder="Describe your website or business" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', minHeight: '70px',
            }} />
            <label style={{
              fontWeight: 'bold',
              color: '#FF851B',
              background: 'rgba(255,133,27,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short description for your website" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', minHeight: '70px',
            }} />
          </div>
          {/* Column 2: Contact & Address */}
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 16px rgba(60,60,120,0.10)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{
              fontWeight: 'bold',
              color: '#B10DC9',
              background: 'rgba(177,13,201,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Contact Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact phone number" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }} />
            <label style={{
              fontWeight: 'bold',
              color: '#FF4136',
              background: 'rgba(255,65,54,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Contact Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Contact email address" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }} />
            <label style={{
              fontWeight: 'bold',
              color: '#39CCCC',
              background: 'rgba(57,204,204,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Website URL:</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder={`Website URL (${API_BASE_URL}...)`} style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }} />
            <label style={{
              fontWeight: 'bold',
              color: '#3D9970',
              background: 'rgba(61,153,112,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Business address" style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }} />
          </div>
          {/* Column 3: Social Media & Template */}
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 16px rgba(60,60,120,0.10)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{
              fontWeight: 'bold',
              color: '#85144b',
              background: 'rgba(133,20,75,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Social Media Accounts:</label>
            {formData.socialAccounts.map((account, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select value={account.type} onChange={e => handleSocialChange(idx, 'type', e.target.value)} style={{ padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem' }}>
                  <option value="">Select Type</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Pinterest">Pinterest</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="url"
                  value={account.url}
                  onChange={e => handleSocialChange(idx, 'url', e.target.value)}
                  placeholder={`Enter ${account.type || 'social'} profile URL`}
                  style={{ padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', flex: 1 }}
                />
                {formData.socialAccounts.length > 1 && (
                  <button type="button" onClick={() => removeSocialInput(idx)} style={{ background: '#ff4e50', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 0.8rem', cursor: 'pointer' }}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSocialInput} style={{ background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)', color: '#fff', border: 'none', borderRadius: '1rem', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>+ Add Social Account</button>
            <label style={{
              fontWeight: 'bold',
              color: '#F012BE',
              background: 'rgba(240,18,190,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Selected Template:</label>
            <select name="templateId" value={formData.templateId} onChange={handleChange} style={{
              padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem',
            }}>
              {filteredTemplates.length === 0 ? (
                <option value="">No templates available for this site type</option>
              ) : (
                filteredTemplates.map(t => (
                  <option key={t.folderName} value={t.folderName}>{t.name || t.folderName}</option>
                ))
              )}
            </select>
            {/*
            {formData.templateId && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img
                  src={getTemplateImageUrl(formData.templateId)}
                  alt="Template Preview"
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '0.7rem', boxShadow: '0 2px 8px rgba(60,60,120,0.10)', background: '#f6f8fa' }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `${API_BASE_URL}/via.placeholder.com/120x80?text=No+Image`;
                    e.target.nextSibling && (e.target.nextSibling.textContent = 'No template image found');
                  }}
                />
                <div style={{ fontSize: '0.95rem', color: '#4a5a6a', marginTop: '0.3rem' }}>Template Preview</div>
              </div>
            )}
            */}
          </div>
          {/* Column 4: Images & Services */}
          <div style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 4px 16px rgba(60,60,120,0.10)', padding: '2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'flex-start' }}>
            <label style={{
              fontWeight: 'bold',
              color: '#7FDBFF',
              background: 'rgba(127,219,255,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Upload Logo/Images (Max 5):</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{
              padding: '0.5rem', borderRadius: '0.7rem', border: '1px solid #d0d7de',
            }} />
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '0.7rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(60,60,120,0.10)', background: '#f6f8fa' }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.7rem' }}
                    />
                  </div>
                ))}
              </div>
            )}
            <label style={{
              fontWeight: 'bold',
              color: '#FFDC00',
              background: 'rgba(255,220,0,0.08)',
              padding: '0.45rem 1rem',
              borderRadius: '0.7rem',
              fontSize: '1.08rem',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
              marginBottom: '0.2rem',
              display: 'inline-block',
            }}>Services:</label>
            <div style={{ width: '100%' }}>
              {formData.services.map((service, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={service}
                    onChange={e => {
                      const updated = [...formData.services];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, services: updated });
                    }}
                    placeholder={`Enter service ${idx + 1}`}
                    style={{
                      padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', flex: 1
                    }}
                  />
                  {formData.services.length > 1 && (
                    <button type="button" onClick={() => {
                      const updated = formData.services.filter((_, i) => i !== idx);
                      setFormData({ ...formData, services: updated });
                    }} style={{ background: '#ff4e50', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 0.8rem', cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, services: [...formData.services, ''] })} style={{ background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)', color: '#fff', border: 'none', borderRadius: '1rem', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>+ Add Service</button>
            </div>
          </div>
          {/* Submit Button & Message */}

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.8rem 2.2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)',
            transition: 'transform 0.2s',
          }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? 'Processing...' : 'Generate Website'}
          </button>
          <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '0.5rem' }}>{message}</p>
        </form>
        {/* Floating quote at bottom right, always visible */}
        <div style={{
          position: 'fixed',
          right: '2.5rem',
          bottom: '2.5rem',
          zIndex: 9999,
          background: 'linear-gradient(90deg, #f8ffae 0%, #43c6ac 100%)',
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          fontSize: '1.1rem',
          color: '#191654',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
          textAlign: 'center',
          maxWidth: '320px',
        }}>
          "The best way to predict the future is to create it." – Peter Drucker
        </div>
      </div>
    {/* Footer */}
    <footer style={{
      width: '100%',
      textAlign: 'center',
      padding: '1.1rem 0 0.7rem 0',
      fontSize: '1.05rem',
      color: '#191654',
      background: 'rgba(255,255,255,0.55)',
      borderTop: '2px solid #43c6ac',
      marginTop: '2rem',
      fontWeight: '500',
      letterSpacing: '0.04em',
      boxShadow: '0 -2px 12px rgba(60,60,120,0.07)',
      position: 'relative',
      zIndex: 2,
    }}>
      &copy; {new Date().getFullYear()} Site Builder. All rights reserved.
    </footer>
  </div>

  );
}

export default Editor;