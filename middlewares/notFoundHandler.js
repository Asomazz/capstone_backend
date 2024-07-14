const notFound = (req, res, next) => {
  return res.status(404).json({ msg: "page is not found :( " });
};

module.exports = notFound;
