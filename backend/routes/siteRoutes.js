const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

// POST: /api/create-site
router.post('/create-site', siteController.upload.array('images', 5), siteController.createSite);

// GET: /api/download/:id
router.get('/download/:id', siteController.downloadSite);

// GET: /api/preview/:id
router.get('/preview/:id', siteController.previewSite);

module.exports = router;