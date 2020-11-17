const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Error } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const APP_SECRET = process.env.APP_SECRET;
async function createToken(data) {
  return jwt.sign({ ...data, iat: Date.now() }, APP_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
}

router.post('/', async (req, res) => {
  const userData = ({ email, password, username } = req.body);
  try {
    const user = new User({ ...userData });
    await user.save();
    const token = await createToken({ user: { email, username } });
    return res.json({ token });
  } catch (error) {
    if (error.name === 'MongoError') {
      const validationerrors = [];
      Object.keys(error.keyValue).forEach(key => validationerrors.push(`${key} ${error.keyValue[key]} already exists`))
      return res.status(400).send(validationerrors);
    }
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user === null) {
      return res.status(401).send("Incorrect Credentials")
    }
    const isPasswordMatch = await user.hasPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).send("Incorrect Credentials")
    }
    else {
      const token = await createToken({ user });
      return res.json({ token });
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
});
module.exports = router;