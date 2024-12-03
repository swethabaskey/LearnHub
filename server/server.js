const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/learnhub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  status: String,
});

const Student = mongoose.model("Student", studentSchema);


app.post("/add-student", async (req, res) => {
  const { name, email, phone, course, status } = req.body;

  const newStudent = new Student({
    name,
    email,
    phone,
    course,
    status,
  });

  try {
    const savedStudent = await newStudent.save();

    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ status: "Placed" });
    const unplacedStudents = await Student.countDocuments({ status: "Unplaced" });

    res.status(200).json({
      message: "Student added successfully!",
      newStudentId: savedStudent._id,
      totalStudents,
      placedStudents,
      unplacedStudents,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

app.delete("/delete-student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Student.findByIdAndDelete(id);

    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ status: "Placed" });
    const unplacedStudents = await Student.countDocuments({ status: "Unplaced" });

    res.status(200).json({
      message: "Student deleted successfully!",
      totalStudents,
      placedStudents,
      unplacedStudents,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

app.get("/student-counts", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ status: "Placed" });
    const unplacedStudents = await Student.countDocuments({ status: "Unplaced" });

    res.status(200).json({
      totalStudents,
      placedStudents,
      unplacedStudents,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve student counts" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
