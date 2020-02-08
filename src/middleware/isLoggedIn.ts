export default (req, res, next) => {
  if (req.user) {
    return next()
  } else {
    return res.status(403).send({ message: 'You must be logged in to do that.' })
  }
}