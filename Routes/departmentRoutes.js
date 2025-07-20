const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartmentsByFaculty,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/DepartmentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // <-- import multer config

// Create department with image
router.post(
  '/:facultyId',
  protect,
  adminOnly,
  upload.single('image'),
  createDepartment
);

// Update department with optional new image
router.put(
  '/update/:id',
  protect,
  adminOnly,
  upload.single('image'),
  updateDepartment
);

// Delete department
router.delete('/:id', protect, adminOnly, deleteDepartment);

// Get departments by faculty
router.get('/:facultyId', getDepartmentsByFaculty);

module.exports = router;
