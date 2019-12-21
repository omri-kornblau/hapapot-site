const routeError = (req, res, next) => err => {
  if (err.isBoom) {
    res.status(err.output.statusCode).send(err.output.payload);
  } else if (err.isJoi) {
    res.status(400).send(err);
  } else {
    next(err);
  }
}

const handleAsyncErrors = fn => (req, res, next) => {
  const fnReturn = fn(req, res, next);
  return Promise
    .resolve(fnReturn)
    .catch(routeError(req, res, next));
}

module.exports = handleAsyncErrors;