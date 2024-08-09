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
app.use('/api', fileRoutes);





app.listen(PORT, () => {
    console.log(`connected${PORT}`);
});