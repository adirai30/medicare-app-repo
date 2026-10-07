const express = require("express");
const router = express.Router();

// Temporary in-memory patient storage
const patients = [];

// CREATE PATIENT
router.post("/", (req, res) => {
  const {
    name,
    phone,
    email,
    age,
    gender,
    address
  } = req.body;

  // Validate required fields
  if (!name || !phone || !age || !gender) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, phone, age and gender"
    });
  }

  const patient = {
    id: `PAT-${Date.now()}`,
    name,
    phone,
    email: email || "",
    age,
    gender,
    address: address || "",
    createdAt: new Date().toISOString()
  };

  patients.push(patient);

  res.status(201).json({
    success: true,
    message: "Patient created successfully",
    patient
  });
});

// GET ALL PATIENTS
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: patients.length,
    patients
  });
});

// GET PATIENT BY ID
router.get("/:id", (req, res) => {
  const patient = patients.find(
    patient => patient.id === req.params.id
  );

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found"
    });
  }

  res.json({
    success: true,
    patient
  });
});

// DELETE PATIENT
router.delete("/:id", (req, res) => {
  const index = patients.findIndex(
    patient => patient.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Patient not found"
    });
  }

  const deletedPatient = patients.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Patient deleted successfully",
    patient: deletedPatient
  });
});

module.exports = router;