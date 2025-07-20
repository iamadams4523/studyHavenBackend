const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  createMaterial,
  getMaterialsByLevel,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
} = require('../controllers/MaterialController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// ✅ Create material (with file & image)
router.post(
  '/:levelId',
  protect,
  adminOnly,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  createMaterial
);

// ✅ Get materials by level (with pagination)
router.get('/:levelId', getMaterialsByLevel);

// ✅ Update material metadata
router.put('/:id', protect, adminOnly, updateMaterial);

// ✅ Delete material
router.delete('/:id', protect, adminOnly, deleteMaterial);

// ✅ Download material file
router.get('/download/:id', downloadMaterial);

module.exports = router;
