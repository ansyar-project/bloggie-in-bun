import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'node:fs';
// import file from 'bun:file';

const app = express();
const PORT = process.env.PORT || 3000;

let title = '';
let content = '';
let writerName = '';
let imagePath = '';

setInterval(() => {
    title = '';
    content = '';
    console.log('Title and content reset');
  }, 5 * 60 * 1000); // 1 minutes

// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const customName = file.originalname; // Custom name for the file
        cb(null, customName);
    }
  });

// File filter to accept only PNG files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept PNG files
    } else {
      cb(null, false); // Reject non-PNG files
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render('index', { success: false, error: null });
    }  );

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/view-post', (req, res) => {
    res.render('view-post', { title: title, content: content, imagePath: imagePath, writerName: writerName });
});

app.post('/submit', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.render('index', { success: false, error: 'Please upload an image.' });
    }
    const uploadedPath = req.file.path;
    const pngPath = path.join('public/uploads', 'image.png');

    try {
        const uploadedImage = Bun.file(uploadedPath);
        await Bun.write(pngPath, uploadedImage);

        // Optionally delete original file if not PNG
        fs.unlinkSync(uploadedPath);
        
        // const ext = path.extname(file.originalname);
        imagePath = `/uploads/image.png`; // Store the path to the uploaded image
        title = req.body.title;
        content = req.body.content;
        writerName = req.body.writerName;
        res.render('index', { success: true, error: null});
        
    } catch (conversionErr) {
        console.error('Image conversion error:', conversionErr);
        res.render('index', { success: false, error: 'Image conversion failed.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});