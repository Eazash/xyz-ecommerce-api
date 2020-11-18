'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/xyz';
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config()
process.env.PUBLIC_DIR = path.join(process.cwd(), 'public');

const swagger_options = YAML.load('./swagger.yml');
const swaggerUi = require('swagger-ui-express');
const auth = require('./middleware/auth');

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
//Register auth middleware
app.use('/api', auth);

//Register handler for Item routes
app.use('/api/items', require("./routes/items"));

//Register handler for User routes and login and auth
app.use('/api/users', require("./routes/users"));

//Register handler for Cart related routes
app.use('/api/cart', require("./routes/carts"));
app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swagger_options));

app.listen(PORT, () => console.log(`API server running at ${PORT}`));