const multer = require('multer');
const express = require('express');
const router = express.Router();

// Define a storage strategy for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Define a route for file upload
router.post('/', upload.single('file'),  (req, res) => {
    console.log(req);
    
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.send(`File uploaded successfully. Image URL: ${imageUrl}`);
});

module.exports = router;
