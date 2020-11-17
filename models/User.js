
const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new Schema({
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
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const hash = await bcryptjs.hash(this.password, 10);
  this.password = hash;
})
UserSchema.methods.hasPassword = async function (candidate) {
  return bcryptjs.compare(candidate, this.password);
}
module.exports = User = new model("User", UserSchema);
