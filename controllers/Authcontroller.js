const User = require('../models/User');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: 'Email already exists' });

    const lastUser = await User.findOne().sort({ userId: -1 });
    const nextUserId = (lastUser?.userId || 0) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId: nextUserId,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res
      .status(201)
      .json({ msg: 'User created successfully', userId: nextUserId });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // No token generation
    res.json({
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

const uploadImage = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.image = req.file.path; // or file.filename if you serve by name
    await user.save();

    res.json({ msg: 'Image uploaded successfully', imagePath: user.image });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { signin, signup, uploadImage };
