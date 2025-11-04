const Website = require('../models/websiteModel');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const archiver = require('archiver');

// --- Multer Configuration for File Uploads ---
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
fs.ensureDirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- Template Builder / Automation Engine ---

const generateSite = async (siteData) => {
    console.log('--- generateSite called ---');
    console.log('siteData:', siteData);
    const templateDir = path.join(__dirname, '..', 'templates', siteData.templateId);
    const outputDir = path.join(__dirname, '..', 'public', 'sites', siteData._id.toString());
    const templateFile = path.join(templateDir, 'index.ejs');
    console.log('templateDir:', templateDir);
    console.log('outputDir:', outputDir);
    console.log('templateFile:', templateFile);

    await fs.remove(outputDir);
    await fs.ensureDir(outputDir);
    console.log('Output directory prepared.');

        // Pass all variables directly for EJS template
        const htmlOutput = await ejs.renderFile(templateFile, {
            name: siteData.name || '',
            siteType: siteData.siteType || '',
            about: siteData.about || '',
            description: siteData.description || '',
            services: siteData.services || [],
            contact: siteData.contact || {},
            address: siteData.address || '',
            website: siteData.website || '',
            socialAccounts: siteData.socialAccounts || [],
            images: siteData.images || []
        });
    const htmlPath = path.join(outputDir, 'index.html');
    await fs.writeFile(htmlPath, htmlOutput);
    console.log('HTML file written:', htmlPath);

    await fs.copy(path.join(templateDir, 'style.css'), path.join(outputDir, 'style.css'));
    console.log('CSS file copied.');
    const UPLOAD_BASE_URL = '/public/uploads/';
    siteData.images.forEach(imageName => {
        console.log('Copying image:', imageName);
        fs.copySync(
            path.join(__dirname, '..', UPLOAD_BASE_URL, imageName),
            path.join(outputDir, imageName)
        );
    });
    await Website.findByIdAndUpdate(siteData._id, { sitePath: `/public/sites/${siteData._id}` });
    console.log('Database updated with sitePath.');
    return outputDir;
};


exports.createSite = async (req, res) => {
    console.log('--- createSite called ---');
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);
        const { name, templateId, about, services, contact } = req.body;
        const images = req.files ? req.files.map(file => file.filename) : [];
        let newWebsite = new Website({
            name,
            templateId,
            about,
            services: JSON.parse(services),
            contact: JSON.parse(contact),
            images
        });
        console.log('New website object:', newWebsite);
        const savedWebsite = await newWebsite.save();
        console.log('Website saved:', savedWebsite);
        await generateSite(savedWebsite);
        console.log('Site generation complete.');
        res.status(201).json({
            message: "Website generated successfully!",
            websiteId: savedWebsite._id
        });
    } catch (error) {
        console.error("Site creation failed:", error);
        console.error("Request body:", req.body);
        console.error("Uploaded files:", req.files);
        if (error && error.stack) {
            console.error("Error stack:", error.stack);
        }
        res.status(500).send({
            message: "Server Error creating site.",
            error: error.message || error,
        });
    }
};

exports.downloadSite = async (req, res) => {
    console.log('--- downloadSite called ---');
    try {
        console.log('Download request for ID:', req.params.id);
        const website = await Website.findById(req.params.id);
        console.log('Website found:', website);
        if (!website || !website.sitePath) return res.status(404).send('Site not found or not yet generated.');
        const sourceDir = path.join(__dirname, '..', website.sitePath);
        const outputZip = path.join(__dirname, '..', 'public', `website_${website._id}.zip`);
        console.log('Source dir:', sourceDir);
        console.log('Output zip:', outputZip);
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(outputZip);
        output.on('close', () => {
            console.log('Zip file closed, sending download.');
            res.download(outputZip, `website_${website.name}.zip`, (err) => {
                if (err) console.error("Download error:", err);
                fs.remove(outputZip);
            });
        });
        archive.on('error', (err) => { throw err; });
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    } catch (error) {
        console.error("Download generation failed:", error);
        res.status(500).send("Error generating zip file.");
    }
};

exports.previewSite = async (req, res) => {
    console.log('--- previewSite called ---');
    try {
        console.log('Preview request for ID:', req.params.id);
        const website = await Website.findById(req.params.id);
        console.log('Website found:', website);
        if (!website || !website.sitePath) {
            console.log('Site not found or sitePath missing.');
            return res.status(404).send('Site not found.');
        }
        const port = process.env.PORT || 5000;
        const previewURL = `http://localhost:${port}${website.sitePath}/index.html`;
        console.log('Preview URL:', previewURL);
        res.json({ previewURL });
    } catch (error) {
        console.error("Preview generation failed:", error);
        res.status(500).send({ message: "Error generating preview.", error: error.message || error });
    }
};

// --- Controller Functions ---
exports.upload = upload;