const jwt = require('jsonwebtoken');

const APP_SECRET = process.env.APP_SECRET

module.exports = function (req, res, next) {
  if (req.url === '/users/register' || req.url === '/users/login') return next();
  const bearerToken = req.get('Authorization');
  if (!bearerToken) {
    return res.sendStatus(401);
  }
  const token = bearerToken.split(' ')[1];
  try {
    const { user } = jwt.verify(token, APP_SECRET, { algorithms: ["HS256"] });
    req.user = { id: user._id };
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error);
      return res.sendStatus(401);
    }
    console.log(error);
    return res.sendStatus(500)
  }
}