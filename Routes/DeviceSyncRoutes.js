const express = require("express");
const { syncBiometricData } = require("../Controllers/Attendance/DeviceSyncControllers");
const { validateSyncBiometric } = require("../utils/Validators/AttendanceValidators");

const router = express.Router();

// This route receives data from the biometric device. 
// Note: In production, you might want an API Key middleware here instead of JWT.
router.post("/sync", validateSyncBiometric, syncBiometricData);

module.exports = router;
