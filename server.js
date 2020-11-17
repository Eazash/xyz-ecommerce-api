'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/xyz';
const YAML = require('yamljs');
require('dotenv').config()

const swagger_options = YAML.load('./swagger.yml');
const swaggerUi = require('swagger-ui-express');

mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => console.log("DB connection succesful")).catch(error => {
  console.log(error);
  process.exit(1);
})
app.use(express.json({ extended: false }));
//Register handler for Item routes
app.use('/api/items', require("./routes/items"));

//Register handler for User routes and login and auth
app.use('/api/users', require("./routes/users"));
app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swagger_options));

app.listen(PORT, () => console.log(`API server running at ${PORT}`));