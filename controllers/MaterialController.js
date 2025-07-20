const fs = require('fs');
const path = require('path');
const Material = require('../models/Materials');
const Level = require('../models/Level');
const Department = require('../models/Department');
const Faculty = require('../models/Faculty');

// ✅ Create Material with file & image upload
exports.createMaterial = async (req, res) => {
  try {
    const { title, type } = req.body;
    const { levelId } = req.params;

    // Validate input
    if (!title || !type) {
      return res.status(400).json({ msg: 'Title and type are required' });
    }
    if (!['handout', 'past-question'].includes(type)) {
      return res.status(400).json({ msg: 'Invalid material type' });
    }

    const file = req.files?.file?.[0];
    const image = req.files?.image?.[0];
    if (!file) {
      return res.status(400).json({ msg: 'File is required' });
    }
    if (!image) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    // Validate level
    const level = await Level.findById(levelId);
    if (!level) return res.status(404).json({ msg: 'Level not found' });

    // Get department & faculty
    const department = await Department.findById(level.department);
    if (!department)
      return res.status(404).json({ msg: 'Department not found' });

    const faculty = await Faculty.findById(department.faculty);
    if (!faculty) return res.status(404).json({ msg: 'Faculty not found' });

    // Create new material
    const material = new Material({
      title,
      type,
      fileUrl: file.path, // stored path
      image: image.path, // stored image path
      level: level._id,
      department: department._id,
      faculty: faculty._id,
    });

    await material.save();

    res.status(201).json({
      msg: 'Material created successfully',
      material,
    });
  } catch (err) {
    console.error('CREATE MATERIAL ERROR:', err);
    res
      .status(500)
      .json({ msg: 'Error creating material', error: err.message });
  }
};

// ✅ Get materials by level with pagination
exports.getMaterialsByLevel = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const levelId = req.params.levelId;

    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      Material.find({ level: levelId })
        .populate('level', 'name')
        .populate('department', 'name')
        .populate('faculty', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Material.countDocuments({ level: levelId }),
    ]);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      materials,
    });
  } catch (err) {
    console.error('GET MATERIALS ERROR:', err);
    res
      .status(500)
      .json({ msg: 'Error fetching materials', error: err.message });
  }
};

// ✅ Update material metadata (not files)
exports.updateMaterial = async (req, res) => {
  try {
    const updated = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ msg: 'Material not found' });
    res.json({ msg: 'Material updated successfully', updated });
  } catch (err) {
    console.error('UPDATE MATERIAL ERROR:', err);
    res
      .status(500)
      .json({ msg: 'Error updating material', error: err.message });
  }
};

// ✅ Delete material and its files
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ msg: 'Material not found' });

    // Delete stored files
    if (material.fileUrl && fs.existsSync(material.fileUrl)) {
      fs.unlink(material.fileUrl, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }
    if (material.image && fs.existsSync(material.image)) {
      fs.unlink(material.image, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted successfully' });
  } catch (err) {
    console.error('DELETE MATERIAL ERROR:', err);
    res
      .status(500)
      .json({ msg: 'Error deleting material', error: err.message });
  }
};

// ✅ Download material file
exports.downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ msg: 'Material not found' });

    const filePath = path.resolve(material.fileUrl);
    res.download(filePath, (err) => {
      if (err) {
        console.error('DOWNLOAD ERROR:', err);
        res.status(500).json({ msg: 'Error downloading file' });
      }
    });
  } catch (err) {
    console.error('DOWNLOAD MATERIAL ERROR:', err);
    res.status(500).json({ msg: 'Error downloading file', error: err.message });
  }
};
