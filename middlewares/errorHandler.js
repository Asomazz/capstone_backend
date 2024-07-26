const errorHandler = (error, req, res, next) => {
  console.log(error);
  return res.status(error.status || 400).json(error.message);
};

module.exports = errorHandler;
