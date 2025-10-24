function saveUrl(req, res, next) {
  res.locals.url = req.session.url;
  next();
}
module.exports = saveUrl;