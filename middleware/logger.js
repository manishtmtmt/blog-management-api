const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.url;

  console.log(`${timestamp} - ${method} request to ${url}`);
  next();
};

module.exports = logger;
