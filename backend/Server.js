const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Required for frontend communication
const path = require('path');
const siteRoutes = require('./routes/siteRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Serve generated site files publicly for preview/download
// Creates a public directory to serve generated sites and uploaded images
app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use('/api', siteRoutes);
app.use('/api/admin', adminRoutes);
// Serve template folders and images statically
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/websiteBuilderDB')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));