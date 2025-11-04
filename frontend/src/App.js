import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import PreviewPublish from './pages/PreviewPublish';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Router>
     
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Editor />} />
          <Route path="/publish/:id" element={<PreviewPublish />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;