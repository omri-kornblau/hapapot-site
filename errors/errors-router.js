const errorRoutes = [
  {
    condition: err => err.isBoom,
    handler: (res, err) => res.status(err.output.statusCode)
      .send(err.output.payload)
  },
  {
    condition: err => err.isJoi,
    handler: (res, err) => res.status(400).send(err)
  }
];

exports.route = (req, res, next) => err => {
  console.error(err);
  const matchedAnyError = errorRoutes.some(route => {
    if (route.condition(err)) {
      route.handler(res, err);
      return true;
    }
  });
  return matchedAnyError ? null : next(err.message)
}
