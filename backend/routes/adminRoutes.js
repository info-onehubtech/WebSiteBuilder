const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/login', adminController.login);
router.post('/upload-template', upload.single('templateZip'), adminController.uploadTemplate);
router.post('/upload-files', upload.array('files', 10), adminController.uploadFiles);
router.get('/templates', adminController.listTemplates);
router.delete('/templates/:name', adminController.deleteTemplate);
router.post('/update-files/:name', upload.array('files', 2), adminController.updateTemplateFiles);



module.exports = router;
