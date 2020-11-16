
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = User = new model("User", UserSchema);
