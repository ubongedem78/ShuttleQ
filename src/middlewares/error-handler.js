const errorHandlerMiddleware = (err, req, res, next) => {
  try {
    let customError = {
      statusCode: err.statusCode || 500, // Default to internal server error
      msg: err.message || "Something went wrong, try again later",
    };

    // Handle PostgreSQL specific errors
    if (err.name === "SequelizeUniqueConstraintError") {
      // Unique constraint violation (e.g., duplicate key)
      customError.msg = "Duplicate value entered, please choose another value";
      customError.statusCode = 400; // Bad Request
    } else if (err.name === "SequelizeValidationError") {
      // Sequelize validation error
      customError.msg = err.errors.map((error) => error.message).join(", ");
      customError.statusCode = 400; // Bad Request
    } else if (err.name === "SequelizeForeignKeyConstraintError") {
      // Foreign key constraint violation
      customError.msg = "Invalid reference to a non-existing resource";
      customError.statusCode = 400; // Bad Request
    } else if (err.name === "SequelizeDatabaseError") {
      // Other Sequelize database errors
      customError.msg = "Error occurred"; // Database Error
      customError.statusCode = 500; // Internal Server Error
    }

    return res
      .status(customError.statusCode)
      .json({ error: { msg: customError.msg } });
  } catch (error) {
    console.error("Unexpected error", error);
    return res.status(500).json({ error: { msg: "Unexpected error" } });
  }
};

module.exports = errorHandlerMiddleware;
