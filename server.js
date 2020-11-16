'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/xyz';

mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => console.log("DB connection succesful")).catch(error => {
  console.log(error);
  process.exit(1);
})

app.listen(PORT, () => console.log(`API server running at ${PORT}`));