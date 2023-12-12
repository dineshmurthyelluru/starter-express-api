const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://demo:demo@cluster0.hxofn2k.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Student Schema
const studentSchema = new mongoose.Schema({
  StudentName: String,
  studentClass: String,
  students: Number,
  fatherName: String,
  motherName: String,
});

const Student = mongoose.model('Studenttest', studentSchema);

// Validation middleware
const validateStudent = [
  body('StudentName').notEmpty().withMessage('StudentName is required'),
  body('students').isInt({ min: 0 }).withMessage('Students must be a positive integer'),
  body('studentClass').notEmpty().withMessage('StudentClass is required'),
  body('fatherName').notEmpty().withMessage('FatherName is required'),
  body('motherName').notEmpty().withMessage('MotherName is required'),
];

// RESTful API Endpoints

// Create a student
app.post('/students', validateStudent, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { StudentName, studentClass, students, fatherName, motherName } = req.body;
    const student = new Student({ StudentName, studentClass, students, fatherName, motherName });
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a student by ID
app.patch('/students/:id', validateStudent, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { StudentName, studentClass, students, fatherName, motherName } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { StudentName, studentClass, students, fatherName, motherName }, { new: true });
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
