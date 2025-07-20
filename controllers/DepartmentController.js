const Department = require('../models/Department');

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { facultyId } = req.params;

    // Check for image from multer
    if (!req.file) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    const dept = new Department({
      name,
      description,
      image: req.file.path, // multer sets this
      faculty: facultyId,
    });

    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({
      msg: 'Error creating department',
      error: err.message,
    });
  }
};

exports.getDepartmentsByFaculty = async (req, res) => {
  try {
    const depts = await Department.find({
      faculty: req.params.facultyId,
    }).populate('faculty', 'name'); // show faculty name if needed
    res.json(depts);
  } catch (err) {
    res.status(500).json({
      msg: 'Error fetching departments',
      error: err.message,
    });
  }
};

// UPDATE DEPARTMENT
exports.updateDepartment = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If an image file is uploaded, add it to updateData
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      msg: 'Error updating department',
      error: err.message,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Department deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Error deleting department', error: err.message });
  }
};
