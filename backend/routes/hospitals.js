const express = require("express");
const router = express.Router();

const hospitals = [
  {
    id: 1,
    name: "MediCare City Hospital",
    location: "Gurugram, Haryana",
    rating: 4.8,
    services: [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Emergency Care"
    ]
  },
  {
    id: 2,
    name: "PrimeCare Medical Center",
    location: "New Delhi",
    rating: 4.7,
    services: [
      "Orthopedics",
      "Dermatology",
      "Diagnostics"
    ]
  },
  {
    id: 3,
    name: "CityLife Hospital",
    location: "Noida, Uttar Pradesh",
    rating: 4.8,
    services: [
      "General Medicine",
      "Pediatrics",
      "Laboratory"
    ]
  }
];

// GET all hospitals
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: hospitals.length,
    hospitals
  });
});

// GET hospital by ID
router.get("/:id", (req, res) => {
  const hospital = hospitals.find(
    hospital => hospital.id === Number(req.params.id)
  );

  if (!hospital) {
    return res.status(404).json({
      success: false,
      message: "Hospital not found"
    });
  }

  res.json({
    success: true,
    hospital
  });
});

module.exports = router;