const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const morgan = require('morgan');
const app = express();
const { errorHandler } = require("./Middlewares/errorHandler");
const authRoutes = require("./Routes/Auth/AuthRoutes");
const ManagementRoutes = require("./Routes/ManagementRoutes/AllRoutes");

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(cors({ origin: "*" }));
// app.use(xssClean());

// Logging
app.use(morgan('dev'));




// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/management", ManagementRoutes);




// Handling unhandled routes
app.all(/(.*)/, (req, res, next) => {
  // Check if it's the root path, maybe redirect to api-docs
  if (req.originalUrl === "/") {
    return res.redirect("/api-docs");
  }
  
  res.status(404).json({
    status: "fail",
    message: `لا يمكن العثور على المسار ${req.originalUrl} على هذا الخادم`,
  });
});

// ===== Global Error Handler =====
app.use(errorHandler);

// ===== Start =====
const port = process.env.PORT || 8000;
app.listen(port , () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📝 Swagger Docs: http://localhost:${port}/api-docs`);
    console.log(`-----------------------------------------------`);
});