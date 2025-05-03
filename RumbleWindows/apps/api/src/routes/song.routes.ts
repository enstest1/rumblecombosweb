import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { songController } from '../controllers/song.controller';
import { analysisController } from '../controllers/analysis.controller';
import { comboController } from '../controllers/combo.controller';
import { uploadLimiter } from '../middleware/rateLimiter';

dotenv.config();

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
} else {
  console.log(`Upload directory already exists: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('Received file:', file.originalname, 'with mimetype:', file.mimetype);
  
  // Accept mp3 files and be lenient with mimetype checking
  if (file.mimetype === 'audio/mpeg' || 
      file.mimetype === 'audio/mp3' || 
      file.originalname.toLowerCase().endsWith('.mp3')) {
    console.log('File accepted');
    cb(null, true);
  } else {
    console.log('File rejected: only MP3 files are allowed');
    cb(new Error('Only MP3 files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  }
});

// Song routes
// Debug middleware to log request details
const debugRequest = (req, res, next) => {
  console.log('Upload request received:', { 
    headers: req.headers,
    body: req.body, 
    file: req.file 
  });
  next();
};

router.post('/', debugRequest, uploadLimiter, upload.single('file'), songController.uploadSong);
router.get('/:songId', songController.getSongDetails);
router.get('/:songId/analysis', analysisController.getAnalysisStatus);
router.get('/:songId/combos', comboController.getCombos);
router.post('/:songId/combos/regenerate', comboController.regenerateCombos);

export default router;