const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { Error } = require('mongoose');
const multer = require('multer');
const storage = require('../utils/pictureStorage');
const upload = multer({ storage });
const path = require('path');
const { existsSync } = require('fs');
const { readdir, rmdir, unlink } = require('fs').promises;

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.params.skip);
  try {
    if (req.query.sortBy === "price" || ["desc", "asc"].includes(req.query.order)) {
      const items = await Item.find().skip(skip).limit(limit).populate("vendor", ["username", "email"]).sort({ price: req.query.order })
      return res.json(items);
    }
    const items = await Item.find({}).skip(skip).limit(limit).populate("vendor", ["username", "email"])
    return res.json(items);
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  };
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("vendor", ["username", "email"])
    if (item === null) {
      return res.sendStatus(404)
    }
    return res.json(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

router.post('/', async (req, res) => {
  const itemData = ({ name, description, price } = req.body);
  try {
    const item = new Item({ ...itemData, vendor: req.user.id });
    await item.save();
    return res.json(item);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const validationerrors = [];
      Object.keys(error.errors).forEach(key => validationerrors.push(`${key} is ${error.errors[key].kind}`))
      return res.status(400).send(validationerrors);
    }
    console.log(error);
    return res.sendStatus(500);
  }
})

router.put("/:id", upload.fields([{ name: "pictures" }]), async (req, res) => {
  const itemData = ({ name, description, price } = req.body);
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { ...itemData }, { new: true, omitUndefined: true }).populate("vendor", ["username", "email"])
    if (updatedItem === null) {
      return res.sendStatus(400)
    }
    return res.json(updatedItem);
  } catch (error) {
    if (error instanceof Error.DocumentNotFoundError) {
      return res.sendStatus(404);
    }
    if (error instanceof multer.MulterError) {
      return res.status(400).send("Error during file upload");
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
router.get("/:id/pictures", async (req, res) => {
  const pathToPictures = path.join(process.env.PUBLIC_DIR, req.params.id);
  try {
    const files = await readdir(pathToPictures, { withFileTypes: true });
    return res.json(files);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.sendStatus(404);
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
router.get("/:id/pictures/:filename", async (req, res) => {
  try {
    return res.sendFile(req.params.filename, { root: path.join(process.env.PUBLIC_DIR, req.params.id) });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.sendStatus(404);
    }
    console.log(error);
    return res.sendStatus(500);
  }
});
router.delete("/:id/pictures", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item === null) {
      return res.sendStatus(404);
    }
    if (!item.vendor.equals(req.user.id)) {
      return res.sendStatus(403);
    }
    await rmdir(path.join(process.env.PUBLIC_DIR, req.params.id), { recursive: true });
    return res.sendStatus(200);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.sendStatus(404);
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
router.delete("/:id/pictures/:filename", async (req, res) => {
  try {
    const fileExists = existsSync(path.join(process.env.PUBLIC_DIR, req.params.id, req.params.filename));
    if (!fileExists) {
      return res.sendStatus(400);
    }
    const item = await Item.findById(req.params.id);
    if (!item.vendor.equals(req.user.id)) {
      return res.sendStatus(403);
    }
    await unlink(path.join(process.env.PUBLIC_DIR, req.params.id, req.params.filename));
    return res.sendStatus(200)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.sendStatus(404);
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
router.delete("/:id", async (req, res) => {
  try {
    const tobeDeleted = await Item.findById(req.params.id);
    if (tobeDeleted === null) {
      return res.sendStatus(400);
    }
    tobeDeleted.delete();
    return res.send();
  } catch (error) {
    if (error instanceof Error.CastError) {
      return res.sendStatus(400)
    }
    console.log(error);
    return res.sendStatus(500);
  }
})
module.exports = router;