const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    templateId: { type: String, required: true },
    about: { type: String, default: '' },
    services: [String],
    contact: {
        phone: String,
        email: String,
    },
    images: [{ type: String }], // Array of uploaded image filenames
    // The path where the generated static HTML/CSS files are stored
    sitePath: { type: String }, 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Website', websiteSchema);