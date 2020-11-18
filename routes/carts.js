const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { Types, Error } = require('mongoose');
const _ = require('lodash')

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items',
      populate: 'item'
    })
    return res.json(cart);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.deleteOne({ user: req.user.id });
    if (cart === 0) {
      return res.sendStatus(400);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500)
  }
})
router.put('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart === null) {
      cart = new Cart({ user: req.user.id });
    };
    const orders = req.body;
    orders.forEach(order => {
      const existingItemIndex = _.findIndex(cart.items, function (obj) {
        console.log(order, obj);
        return obj.item.equals(order.item);
      });
      if (existingItemIndex != -1) {
        cart.items[existingItemIndex].quantity += order.quantity;
      } else {
        cart.items.push({ item: Types.ObjectId(order.item), quantity: order.quantity })
      }
    });
    await cart.save();
    return res.json(cart);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const messages = [];
      Object.keys(error.errors).forEach(key => messages.push(error.errors[key].message));
      return res.status(400).json(messages);
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
router.delete('/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({});
    if (cart === null) {
      return res.sendStatus(400);
    }
    const indexOfItemToBeDeleted = _.findIndex(cart.items, o => o.item === Types.ObjectId(req.params.itemId));
    if (indexOfItemToBeDeleted === -1) {
      return res.sendStatus(400)
    }
    cart.items.splice(indexOfItemToBeDeleted, 1);
    await cart.save()
    return res.json(cart)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
module.exports = router;