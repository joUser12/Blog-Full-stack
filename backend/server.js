const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post')
const categoryRoutes = require('./routes/categories')
const userRoutes = require('./routes/user')
const fileRoutes = require('./routes/fileUpload')
const cors = require('cors')
const app = express();
const path = require('path');
const multer = require('multer');
const PORT = process.env.PORT || 8000

// middleWare
app.use(bodyParser.json());
app.use(cors())

// connect to mongDB

mongoose.connect('mongodb://localhost:27017/blog')
    .then(() => {
        console.log(" MongoDB connected");
    }).catch((err) => {
        console.log(err);
    });


// Serve uploaded files as static content
// app.use('/uploads', express.static('uploads'));
// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/file', fileRoutes);



// Set up multer for file upload handling
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Define where to store the files
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Define file naming convention
//     },
// });

// const upload = multer({ storage });
// app.use('/file', express.static('uploads/'));
// // Route for handling file upload
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//     try {
//         const file = req.file;

//         if (!file) {
//             return res.status(400).json({ message: 'No file uploaded.' });
//         }

//         //  const filePath = req.file.filename;
//         //     const fileUrl = `http://localhost:4000/file/${filePath}`; 

//         res.json({
//             message: 'File uploaded successfully!',
//             fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'File upload failed.', error });
//     }
// });


// storage engine 
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const maxSize = 2 * 1024 * 1024; // 2 MB limit

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter: (req, file, cb) => {
        // Custom file filter to check file size
        if (file.size > maxSize) {
            return cb(new Error('File size should not exceed 2 MB'));
        }
        cb(null, true);
    }
});

app.use('/file', express.static('upload/images'));
app.post("/api/upload", (req, res) => {
    // Handle the file upload with error handling
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error (e.g., file size limit exceeded)
            res.status(400).json({ error: err.message });
        } else if (err) {
            // Other unexpected errors
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // File uploaded successfully
            const filePath = req.file.filename;
            const fileUrl = `http://localhost:8000/file/${filePath}`; // Update with your server's URL
            console.log("File uploaded successfully. URL:", fileUrl);
            res.json({ message: "File uploaded successfully", fileUrl });
        }
    });
});






app.listen(PORT, () => {
    console.log(`connected${PORT}`);
});