const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendResetEmail = require('../utilities/sendEmail');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

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
      role: role || 'user',
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      msg: 'User created successfully',
      userId: nextUserId,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
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

    const token = generateToken(user._id, user.role);

    res.json({
      msg: 'Signin successful',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

const uploadImage = async (req, res) => {
  try {
    console.log('FILE:', req.file);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.image = req.file.path; // store image path
    await user.save();

    res.json({ msg: 'Image uploaded successfully', imagePath: user.image });
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send reset email
    await sendResetEmail(user.email, user.username);

    res.json({ msg: 'Reset email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Email not registered' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = {
  signin,
  signup,
  uploadImage,
  forgotPassword,
  resetPassword,
};
