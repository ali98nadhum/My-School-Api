const fs = require("fs");
const { ApiError } = require("../utils/ApiError");

/**
 * Global Error Handler
 * Placed as the last middleware in index.js
 */
const errorHandler = (err, req, res, next) => {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
  if (req.files) {
    Object.values(req.files).forEach((fileArray) => {
      fileArray.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    });
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === "P2002") {
    return res.status(409).json({
      status: "fail",
      message: "A record with the same unique value already exists.",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      status: "fail",
      message: "The requested record was not found.",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid authentication token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Authentication token has expired.",
    });
  }

  // Operational Errors (ApiError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unknown Errors — Do not expose details in production
  console.error("💥 UNEXPECTED ERROR:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
};

module.exports = { errorHandler };