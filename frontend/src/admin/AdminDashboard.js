
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const sidebarBtnStyle = {
    border: 'none',
    borderRadius: '1rem',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background 0.2s, color 0.2s',
    boxShadow: '0 2px 8px rgba(60,60,120,0.10)'
};

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [uploadMessage, setUploadMessage] = useState('');
    const [file, setFile] = useState(null);
    const [indexFile, setIndexFile] = useState(null);
    const [styleFile, setStyleFile] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [updateTarget, setUpdateTarget] = useState(null);
    const [updateIndexFile, setUpdateIndexFile] = useState(null);
    const [updateStyleFile, setUpdateStyleFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [siteType, setSiteType] = useState('Business');

    // --- Update Handlers ---
    const handleUpdateIndexChange = (e) => {
        setUpdateIndexFile(e.target.files[0] || null);
    };
    const handleUpdateStyleChange = (e) => {
        setUpdateStyleFile(e.target.files[0] || null);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!updateIndexFile && !updateStyleFile) return setUploadMessage('Select at least one file to update.');
        const formData = new FormData();
        if (updateIndexFile) formData.append('files', updateIndexFile);
        if (updateStyleFile) formData.append('files', updateStyleFile);
        try {
            await axios.post(`${API_BASE_URL}/api/admin/update-files/${updateTarget}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMessage('Files updated successfully!');
            setUpdateTarget(null);
            setUpdateIndexFile(null);
            setUpdateStyleFile(null);
            fetchTemplates();
        } catch (err) {
            setUploadMessage(err.response?.data?.message || 'Update failed');
        }
    };

    const fetchTemplates = () => {
    axios.get(`${API_BASE_URL}/api/admin/templates`)
            .then(res => setTemplates(res.data.templates))
            .catch(() => setTemplates([]));
    };
    useEffect(() => {
        if (activeTab === 'uploader') {
            fetchTemplates();
        }
    }, [activeTab]);

    const handleDelete = async (templateName) => {
        if (!window.confirm(`Delete template '${templateName}'?`)) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/templates/${templateName}`);
            fetchTemplates();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleIndexChange = (e) => {
        setIndexFile(e.target.files[0] || null);
    };
    const handleStyleChange = (e) => {
        setStyleFile(e.target.files[0] || null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setUploadMessage('Please select a ZIP file.');
        const formData = new FormData();
        formData.append('templateZip', file);
        try {
            await axios.post(`${API_BASE_URL}/api/admin/upload-template`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMessage('Template uploaded successfully!');
        } catch (err) {
            setUploadMessage(err.response?.data?.message || 'Upload failed');
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0] || null);
    };

    const handleFilesUpload = async (e) => {
        e.preventDefault();
        if (!indexFile || !styleFile) return setUploadMessage('Please select both index.ejs and style.css files.');
        if (!folderName.trim()) return setUploadMessage('Please enter a folder name.');
        const formData = new FormData();
        formData.append('files', indexFile);
        formData.append('files', styleFile);
        if (imageFile) formData.append('files', imageFile);
        formData.append('folderName', folderName.trim());
        formData.append('siteType', siteType);
        try {
            await axios.post(`${API_BASE_URL}/api/admin/upload-files`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMessage('Files uploaded successfully!');
            setImageFile(null);
            setFolderName('');
        } catch (err) {
            setUploadMessage(err.response?.data?.message || 'Upload failed');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8ffae' }}>
            {/* Sidebar */}
            <div style={{ width: '220px', background: '#191654', color: '#fff', display: 'flex', flexDirection: 'column', padding: '2rem 1rem', gap: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin</h2>
                <button onClick={() => setActiveTab('dashboard')} style={{ background: activeTab === 'dashboard' ? '#43c6ac' : 'transparent', color: '#fff', border: 'none', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Dashboard</button>
                <button onClick={() => setActiveTab('uploader')} style={{ background: activeTab === 'uploader' ? '#43c6ac' : 'transparent', color: '#fff', border: 'none', borderRadius: '1rem', padding: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Template Uploader</button>
                <div style={{ flexGrow: 1 }}></div>
                <button
                    style={{ ...sidebarBtnStyle, background: '#ff4e50', color: '#fff', fontWeight: 'bold', marginTop: 'auto', boxShadow: '0 2px 8px rgba(60,60,120,0.10)' }}
                    onClick={() => {
                        // Clear any auth state here if needed
                        window.location.href = '/';
                    }}
                >
                    <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🚪</span> Logout
                </button>
            </div>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '3rem', background: '#fff', borderRadius: '2rem 0 0 2rem', boxShadow: '0 8px 32px rgba(60,60,120,0.10)', margin: '2rem 0 2rem 0' }}>
                {activeTab === 'dashboard' && (
                    <div style={{ background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)', borderRadius: '2rem', boxShadow: '0 4px 24px rgba(60,60,120,0.10)', padding: '2.5rem 2rem', marginBottom: '2rem', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', textShadow: '0 2px 8px rgba(30,30,60,0.10)' }}>Welcome to Admin Dashboard</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8ffae', fontWeight: '500', textShadow: '0 2px 8px rgba(30,30,60,0.10)' }}>Use the sidebar to manage templates and view stats.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: '1.2rem', padding: '1rem 2rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 8px rgba(60,60,120,0.10)' }}>
                            <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>📦</span>
                            Total Templates: <span style={{ color: '#f8ffae', fontWeight: 'bold', marginLeft: '0.5rem' }}>{templates.length}</span>
                        </div>
                    </div>
                )}
                {activeTab === 'uploader' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h1>Template Uploader</h1>
                            <a 
                                href={`${API_BASE_URL}/public/template-guide.html`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>📖</span>
                                Template Creation Guide
                            </a>
                        </div>
                        <form onSubmit={handleFilesUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '700px', marginTop: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#191654' }}>Site Type</label>
                                    <select value={siteType} onChange={e => setSiteType(e.target.value)} style={{ padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', minWidth: '160px' }}>
                                        <option value="Business">Business</option>
                                        <option value="Portfolio">Portfolio</option>
                                        <option value="Personal">Personal</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Blog">Blog</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#191654' }}>Folder Name</label>
                                    <input type="text" value={folderName} onChange={e => setFolderName(e.target.value)} placeholder="e.g. temp5 or myTemplate" style={{ padding: '0.7rem', borderRadius: '0.7rem', border: '1px solid #d0d7de', fontSize: '1rem', minWidth: '160px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#191654' }}>index.ejs</label>
                                    <input type="file" accept=".ejs" onChange={handleIndexChange} />
                                    <label style={{ fontWeight: 'bold', color: '#191654' }}>style.css</label>
                                    <input type="file" accept=".css" onChange={handleStyleChange} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#191654' }}>Template Image</label>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </div>
                            <button type="submit" style={{ background: 'linear-gradient(90deg, #191654 0%, #43c6ac 100%)', color: '#fff', border: 'none', borderRadius: '2rem', padding: '0.8rem 2.2rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)', transition: 'transform 0.2s', marginTop: '1rem', alignSelf: 'flex-start' }}>Upload Files</button>
                        </form>
                        <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>{uploadMessage}</p>
                        <p style={{ marginTop: '2rem', color: '#4a5a6a' }}>Upload files directly to temp1 (e.g., index.ejs, style.css).</p>
                        <div style={{ marginTop: '2rem' }}>
                            <h2>Uploaded Templates</h2>
                            {templates.length === 0 ? (
                                <p>No templates found.</p>
                            ) : (
                                <ul style={{ paddingLeft: '1.2rem', fontSize: '1.1rem' }}>
                                                        {templates.map(t => (
                                                            <li key={t.folderName || t} style={{ marginBottom: '0.5rem', color: '#191654', fontWeight: 'bold', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem', padding: '0.7rem 0', borderBottom: '1px solid #eee' }}>
                                                                <span style={{ minWidth: '140px' }}>{t.name || t.folderName || t}</span>
                                                                <span style={{ fontSize: '0.95rem', color: '#43c6ac', fontWeight: 'bold', background: '#f8ffae', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', minWidth: '120px', textAlign: 'center' }}>Site Type: {t.siteType || 'Unknown'}</span>
                                                                <img src={`${API_BASE_URL}/templates/${t.folderName || t}/template.png`} alt="template" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }} onClick={() => setModalImage(`${API_BASE_URL}/templates/${t.folderName || t}/template.png`)} onError={e => {e.target.style.display='none';}} />
                                                                <button onClick={() => handleDelete(t.folderName || t)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.3rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                                                                <button onClick={() => setUpdateTarget(t.folderName || t)} style={{ background: '#43c6ac', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.3rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
                                                                {/* Fullscreen image modal */}
                                                                {modalImage && (
                                                                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,30,30,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                                        <img src={modalImage} alt="template-full" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', background: '#fff', marginBottom: '2rem' }} />
                                                                        <button onClick={() => setModalImage(null)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '2rem', padding: '0.8rem 2.2rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(60, 60, 120, 0.10)' }}>Cancel</button>
                                                                    </div>
                                                                )}
                                                                {updateTarget === (t.folderName || t) && (
                                                                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', background: '#f0f4fa', padding: '1rem', borderRadius: '0.7rem', position: 'absolute', zIndex: 10 }}>
                                                                        <label style={{ fontWeight: 'bold', color: '#191654' }}>index.ejs</label>
                                                                        <input type="file" accept=".ejs" onChange={handleUpdateIndexChange} />
                                                                        <label style={{ fontWeight: 'bold', color: '#191654' }}>style.css</label>
                                                                        <input type="file" accept=".css" onChange={handleUpdateStyleChange} />
                                                                        <button type="submit" style={{ background: 'linear-gradient(90deg, #43c6ac 0%, #191654 100%)', color: '#fff', border: 'none', borderRadius: '2rem', padding: '0.5rem 1.5rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Update Files</button>
                                                                        <button type="button" onClick={() => { setUpdateTarget(null); setUpdateIndexFile(null); setUpdateStyleFile(null); }} style={{ background: '#aaa', color: '#fff', border: 'none', borderRadius: '2rem', padding: '0.5rem 1.5rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>Cancel</button>
                                                                    </form>
                                                                )}
                                                            </li>
                                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
