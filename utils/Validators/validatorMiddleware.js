const { ApiError } = require("../ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // If it's a Zod validation error
    const issues = error.errors || error.issues;
    if (issues && Array.isArray(issues)) {
      const errorMessages = issues.map((err) => err.message).join(", ");
      return next(new ApiError(errorMessages, 400));
    }
    // Otherwise, it's a different kind of error, pass it along
    next(error);
  }
};

module.exports = { validate };
