const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  uploadImage,
} = require('../controllers/Authcontroller');
const upload = require('../middlewares/upload');

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/upload-image', upload.single('image'), uploadImage);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
