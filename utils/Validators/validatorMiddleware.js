const { ApiError } = require("../ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsedData.body !== undefined ? parsedData.body : req.body;
    req.query = parsedData.query !== undefined ? parsedData.query : req.query;
    req.params = parsedData.params !== undefined ? parsedData.params : req.params;
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
