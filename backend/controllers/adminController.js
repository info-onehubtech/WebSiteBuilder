const Admin = require('../models/adminModel');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// --- AUTH ---
// Simple admin login (no hashing, for demo only)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // In production, return a JWT token here
    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- TEMPLATE MANAGEMENT ---
// List template folders
exports.listTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const folders = fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory());
    // Return array of objects for frontend compatibility
    const templates = folders.map(f => {
      const folderPath = path.join(templatesDir, f);
      let siteType = 'Unknown';
      const metadataPath = path.join(folderPath, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          if (metadata.siteType) siteType = metadata.siteType;
        } catch {}
      }
      return { folderName: f, siteType };
    });
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list templates', error: err.message });
  }
};

// Delete a template folder
exports.deleteTemplate = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const folder = req.params.name;
    const folderPath = path.join(templatesDir, folder);
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(404).json({ message: 'Template not found' });
    }
    fs.rmSync(folderPath, { recursive: true, force: true });
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Handle direct file uploads to custom folder or next available tempN folder, save image as template.png
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const templatesDir = path.join(__dirname, '../templates');
    let folderName = req.body.folderName && req.body.folderName.trim();
    if (!folderName) {
      // Find next available tempN folder
      const existing = fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory() && f.startsWith('temp'));
      let nextNum = 1;
      if (existing.length > 0) {
        nextNum = Math.max(...existing.map(f => parseInt(f.replace('temp', '')) || 0)) + 1;
      }
      folderName = `temp${nextNum}`;
    }
    const newFolderPath = path.join(templatesDir, folderName);
    if (fs.existsSync(newFolderPath)) {
      return res.status(400).json({ message: 'Folder name already exists. Choose another.' });
    }
    fs.mkdirSync(newFolderPath);
    let fileCount = 0;
    for (const file of req.files) {
      let destPath;
      // If image, save as template.png
      if (file.mimetype.startsWith('image/')) {
        destPath = path.join(newFolderPath, 'template.png');
      } else {
        destPath = path.join(newFolderPath, file.originalname);
      }
      fs.copyFileSync(file.path, destPath);
      fs.unlinkSync(file.path);
      fileCount++;
    }
    // Save metadata.json with siteType
    const metadata = { siteType: req.body.siteType || 'Unknown' };
    fs.writeFileSync(path.join(newFolderPath, 'metadata.json'), JSON.stringify(metadata, null, 2));
    res.json({ success: true, message: `Uploaded ${fileCount} files to ${folderName}` });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// Update index.ejs and/or style.css in a template folder
exports.updateTemplateFiles = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const folder = req.params.name;
    const folderPath = path.join(templatesDir, folder);
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(404).json({ message: 'Template not found' });
    }
    let fileCount = 0;
    for (const file of req.files) {
      // Accept index.ejs, style.css, and image
      if (file.originalname === 'index.ejs' || file.originalname === 'style.css') {
        const destPath = path.join(folderPath, file.originalname);
        fs.copyFileSync(file.path, destPath);
        fs.unlinkSync(file.path);
        fileCount++;
      } else if (file.mimetype.startsWith('image/')) {
        const destPath = path.join(folderPath, 'template.png');
        fs.copyFileSync(file.path, destPath);
        fs.unlinkSync(file.path);
        fileCount++;
      }
    }
    if (fileCount === 0) {
      return res.status(400).json({ message: 'No valid files uploaded (must be index.ejs, style.css, or image)' });
    }
    res.json({ success: true, message: `Updated ${fileCount} files in ${folder}` });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Handle template ZIP upload and extraction (only root files to temp1)
exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const templatesDir = path.join(__dirname, '../templates');
    const temp1Path = path.join(templatesDir, 'temp1');
    if (!fs.existsSync(temp1Path)) {
      fs.mkdirSync(temp1Path);
    }

    // Extract only root files from ZIP
    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();
    let fileCount = 0;
    // First, try root files
    zipEntries.forEach(entry => {
      if (!entry.isDirectory && !entry.entryName.includes('/')) {
        const destPath = path.join(temp1Path, entry.entryName);
        fs.writeFileSync(destPath, entry.getData());
        fileCount++;
      }
    });

    // If no root files, try first and second-level folders (flatten all files inside)
    if (fileCount === 0) {
      // Find first folder name
      const firstFolder = zipEntries.find(e => e.isDirectory && !e.entryName.includes('/', e.entryName.length - 1));
      if (firstFolder) {
        const folderName = firstFolder.entryName.replace(/\/$/, '');
        // Find second-level folder inside first folder
        const secondFolder = zipEntries.find(e => e.isDirectory && e.entryName.startsWith(folderName + '/') && e.entryName.split('/').length === 2);
        let folderPaths = [folderName];
        if (secondFolder) {
          folderPaths.push(secondFolder.entryName.replace(/\/$/, ''));
        }
        zipEntries.forEach(entry => {
          // Any file inside first or second folder (any depth)
          if (!entry.isDirectory) {
            for (const fPath of folderPaths) {
              if (entry.entryName.startsWith(fPath + '/')) {
                const fileName = entry.entryName.split('/').pop(); // flatten
                const destPath = path.join(temp1Path, fileName);
                fs.writeFileSync(destPath, entry.getData());
                fileCount++;
                break;
              }
            }
          }
        });
      }
    }

    // Remove uploaded ZIP file
    fs.unlinkSync(req.file.path);

    if (fileCount === 0) {
      return res.status(400).json({ message: 'No valid files found in ZIP' });
    }

    res.json({ success: true, message: `Uploaded ${fileCount} files to temp1` });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
