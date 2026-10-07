const express = require("express");
const cors = require("cors");
require("dotenv").config();

const doctorsRoutes = require("./routes/doctors");
const hospitalsRoutes = require("./routes/hospitals");
const appointmentsRoutes = require("./routes/appointments");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    service: "MediCare Backend",
    message: "Hospital appointment API is running"
  });
});

// Doctors API
app.use("/api/doctors", doctorsRoutes);

// Hospitals API
app.use("/api/hospitals", hospitalsRoutes);

// Appointments API
app.use("/api/appointments", appointmentsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MediCare Backend running on http://localhost:${PORT}`);
});