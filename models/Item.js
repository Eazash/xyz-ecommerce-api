const { Schema, model } = require('mongoose');

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})
module.exports = Item = new model("Item", ItemSchema);
