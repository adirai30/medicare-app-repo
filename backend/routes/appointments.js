const express = require("express");
const router = express.Router();

// Temporary in-memory appointment storage
const appointments = [];

// CREATE APPOINTMENT
router.post("/", (req, res) => {
  const {
    patientName,
    phone,
    hospital,
    department,
    doctor,
    date,
    time,
    reason
  } = req.body;

  // Validate required fields
  if (
    !patientName ||
    !phone ||
    !hospital ||
    !department ||
    !doctor ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required appointment details"
    });
  }

  const appointment = {
    id: `MED-${Date.now()}`,
    patientName,
    phone,
    hospital,
    department,
    doctor,
    date,
    time,
    reason: reason || "General consultation",
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  };

  appointments.push(appointment);

  res.status(201).json({
    success: true,
    message: "Appointment successfully booked",
    appointment
  });
});

// GET ALL APPOINTMENTS
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: appointments.length,
    appointments
  });
});

// GET APPOINTMENT BY ID
router.get("/:id", (req, res) => {
  const appointment = appointments.find(
    appointment => appointment.id === req.params.id
  );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found"
    });
  }

  res.json({
    success: true,
    appointment
  });
});

// CANCEL APPOINTMENT
router.delete("/:id", (req, res) => {
  const appointment = appointments.find(
    appointment => appointment.id === req.params.id
  );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found"
    });
  }

  appointment.status = "CANCELLED";

  res.json({
    success: true,
    message: "Appointment cancelled",
    appointment
  });
});

module.exports = router;