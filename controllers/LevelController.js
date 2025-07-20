const Level = require('../models/Level');

// Create Level
exports.createLevel = async (req, res) => {
  try {
    const { name } = req.body;
    const { deptId } = req.params;

    if (!name) {
      return res.status(400).json({ msg: 'Name is required' });
    }

    const level = new Level({ name, department: deptId });
    await level.save();

    res.status(201).json(level);
  } catch (err) {
    console.error('Error creating level:', err);
    res.status(500).json({ msg: 'Error creating level', error: err.message });
  }
};

// Get Levels by Department
exports.getLevelsByDepartment = async (req, res) => {
  try {
    const levels = await Level.find({ department: req.params.deptId }).populate(
      'department',
      'name'
    ); // optional: show department name
    res.json(levels);
  } catch (err) {
    console.error('Error fetching levels:', err);
    res.status(500).json({ msg: 'Error fetching levels', error: err.message });
  }
};

// Update Level
exports.updateLevel = async (req, res) => {
  try {
    const updated = await Level.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Level not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating level:', err);
    res.status(500).json({ msg: 'Error updating level', error: err.message });
  }
};

// Delete Level
exports.deleteLevel = async (req, res) => {
  try {
    const deleted = await Level.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Level not found' });
    }
    res.json({ msg: 'Level deleted successfully' });
  } catch (err) {
    console.error('Error deleting level:', err);
    res.status(500).json({ msg: 'Error deleting level', error: err.message });
  }
};
