const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/auth');
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  generateSignature,
} = require('../controllers/cloudinaryController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.post('/upload', protect, admin, upload.single('image'), uploadImage);
router.post('/upload-multiple', protect, admin, upload.array('images', 10), uploadMultipleImages);
router.post('/upload-url', protect, admin, uploadImage);
router.delete('/:publicId', protect, admin, deleteImage);
router.post('/signature', protect, admin, generateSignature);

module.exports = router;
