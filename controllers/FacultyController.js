const Faculty = require('../models/Faculty');

// ✅ CREATE FACULTY (with image upload)
exports.createFaculty = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ msg: 'Name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    const faculty = new Faculty({
      name,
      description,
      image: req.file.path, // multer sets this
    });

    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    console.error('Error creating faculty:', err);
    res.status(500).json({
      msg: 'Error creating faculty',
      error: err.message,
    });
  }
};

// ✅ GET ALL FACULTIES
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (err) {
    console.error('Error fetching faculties:', err);
    res.status(500).json({
      msg: 'Error fetching faculties',
      error: err.message,
    });
  }
};

// ✅ UPDATE FACULTY (with optional image upload)
exports.updateFaculty = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If new image is uploaded, update the image field
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Faculty.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Faculty not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating faculty:', err);
    res.status(500).json({
      msg: 'Error updating faculty',
      error: err.message,
    });
  }
};

// ✅ DELETE FACULTY
exports.deleteFaculty = async (req, res) => {
  try {
    const deleted = await Faculty.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Faculty not found' });
    }
    res.json({ msg: 'Faculty deleted' });
  } catch (err) {
    console.error('Error deleting faculty:', err);
    res.status(500).json({
      msg: 'Error deleting faculty',
      error: err.message,
    });
  }
};
