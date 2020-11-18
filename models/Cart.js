const { Schema, model } = require('mongoose');
const Item = require('./Item')
const CartSchema = new Schema({
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        validate: {
          validator: async function (v) {
            return Item.exists(v);
          },
          message: props => `Invalid Item id: ${props.value}`
        }
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
})
CartSchema.pre('updateOne', function () {
  this.set({ updatedAt: new Date() });
});

module.exports = Cart = new model("Cart", CartSchema);