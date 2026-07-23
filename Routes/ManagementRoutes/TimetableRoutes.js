const express = require("express");
const router = express.Router();

const {
  getTimetableEntries,
  getTimetableEntryById,
  createTimetableEntry,
  batchCreateTimetableEntries,
  updateTimetableEntry,
  deleteTimetableEntry
} = require("../../Controllers/Management/TimetableControllers");

const { protect, allowedTo } = require("../../utils/Auth/AuthService");
const { validate } = require("../../utils/Validators/validatorMiddleware");
const {
  createTimetableSchema,
  batchCreateTimetableSchema,
  updateTimetableSchema,
  deleteTimetableSchema,
  getTimetableSchema
} = require("../../utils/Validators/TimetableValidators");

router.use(protect);
router.use(allowedTo("PRINCIPAL", "ADMINISTRATOR"));

router.get("/", getTimetableEntries);
router.get("/:id", validate(getTimetableSchema), getTimetableEntryById);
router.post("/", validate(createTimetableSchema), createTimetableEntry);
router.post("/batch", validate(batchCreateTimetableSchema), batchCreateTimetableEntries);
router.put("/:id", validate(updateTimetableSchema), updateTimetableEntry);
router.delete("/:id", validate(deleteTimetableSchema), deleteTimetableEntry);

module.exports = router;
