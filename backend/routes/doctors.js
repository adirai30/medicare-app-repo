const express = require("express");
const router = express.Router();

const doctors = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    specialty: "Cardiology",
    experience: "12 years",
    rating: 4.9,
    hospital: "MediCare City Hospital"
  },
  {
    id: 2,
    name: "Dr. Ananya Mehta",
    specialty: "Neurology",
    experience: "10 years",
    rating: 4.8,
    hospital: "MediCare City Hospital"
  },
  {
    id: 3,
    name: "Dr. Arjun Kapoor",
    specialty: "Orthopedics",
    experience: "14 years",
    rating: 4.9,
    hospital: "PrimeCare Medical Center"
  },
  {
    id: 4,
    name: "Dr. Priya Nair",
    specialty: "Pediatrics",
    experience: "9 years",
    rating: 4.8,
    hospital: "MediCare Children's Hospital"
  },
  {
    id: 5,
    name: "Dr. Kavya Singh",
    specialty: "Dermatology",
    experience: "8 years",
    rating: 4.7,
    hospital: "PrimeCare Medical Center"
  }
];

// GET all doctors
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: doctors.length,
    doctors
  });
});

// GET doctor by ID
router.get("/:id", (req, res) => {
  const doctor = doctors.find(
    doctor => doctor.id === Number(req.params.id)
  );

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found"
    });
  }

  res.json({
    success: true,
    doctor
  });
});

// Search doctors by specialty
router.get("/search/:specialty", (req, res) => {
  const specialty = req.params.specialty.toLowerCase();

  const results = doctors.filter(
    doctor =>
      doctor.specialty.toLowerCase() === specialty
  );

  res.json({
    success: true,
    count: results.length,
    doctors: results
  });
});

module.exports = router;