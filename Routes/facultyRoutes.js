const express = require('express');
const router = express.Router();
const {
  createFaculty,
  getFaculties,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/FacultyController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // ✅ import your multer config

// ✅ Create a faculty with image upload
router.post('/', protect, adminOnly, upload.single('image'), createFaculty);

// ✅ Update faculty with optional new image
router.put('/:id', protect, adminOnly, upload.single('image'), updateFaculty);

// ✅ Delete a faculty
router.delete('/:id', protect, adminOnly, deleteFaculty);

// ✅ Get all faculties
router.get('/', getFaculties);

module.exports = router;
