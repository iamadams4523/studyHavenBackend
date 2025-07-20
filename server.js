const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const facultyRoutes = require('./Routes/facultyRoutes');
const departmentRoutes = require('./Routes/departmentRoutes');
const levelRoutes = require('./Routes/levelRoutes');
const materialRoutes = require('./Routes/materialRoutes');
const fs = require('fs');
const path = require('path');

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);

  console.log('✔ uploads/ folder created');
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', express.static('uploads')); // serve files

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to database successfully');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error('Connection Failed', err));

app.use('/api', authRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/materials', materialRoutes);
