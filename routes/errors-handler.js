exports.handle = (res, err) => {
  if (err.name === "ValidationError") {
    return res.boom.badRequest('Given user is not valid', err.details);
  } else if (err.code === 11000) {
    return res.boom.badRequest('User already exists', { field: err.keyValue });
  } else {
    return res.boom.internal();
  }
}
