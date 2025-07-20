const express = require('express');
const router = express.Router();
const {
  createLevel,
  getLevelsByDepartment,
  updateLevel,
  deleteLevel,
} = require('../controllers/LevelController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/:deptId', protect, adminOnly, createLevel);
router.get('/:deptId', getLevelsByDepartment);
router.put('/:id', protect, adminOnly, updateLevel);
router.delete('/:id', protect, adminOnly, deleteLevel);

module.exports = router;
