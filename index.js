const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const morgan = require('morgan');
const app = express();
const { errorHandler } = require("./Middlewares/errorHandler");
const authRoutes = require("./Routes/Auth/AuthRoutes");
const SystemRoutes = require("./Routes/SystemRoutes/SystemRoutes");
const ManagementRoutes = require("./Routes/ManagementRoutes/ManagementRoutes");
const TeacherRoutes = require("./Routes/TeacherRoutes/TeacherRoutes");
const StudentRoutes = require("./Routes/StudentsRoutes/StudentRoutes");
const DeviceSyncRoutes = require("./Routes/DeviceSyncRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { filter: true } }));
app.use("/api/auth", authRoutes);
app.use("/api/system", SystemRoutes);
app.use("/api/management", ManagementRoutes);
app.use("/api/teacher", TeacherRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/device", DeviceSyncRoutes);




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
if (require.main === module) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📝 Swagger Docs: http://localhost:${port}/api-docs`);
    console.log(`-----------------------------------------------`);
  });
}

module.exports = app;