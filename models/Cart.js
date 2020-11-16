const { Schema, model } = require('mongoose');

const CartSchema = new Schema({
  items: [
    { type: Schema.Types.ObjectId, ref: "item" }
  ],
  updatedAt: {
    type: Date,
    default: new Date()
  }
})
CartSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = Cart = new model("Cart", CartSchema);