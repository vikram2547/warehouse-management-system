const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Store = require('../models/Store');

// Get inventory for a store
router.get('/store/:storeId', async (req, res) => {
  try {
    const inventory = await Inventory.find({ store: req.params.storeId })
      .populate('product')
      .populate('store', 'name');
    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get available products in a store
router.get('/:storeId/available', async (req, res) => {
  try {
    const inventory = await Inventory.find({
      store: req.params.storeId,
      availableQuantity: { $gt: 0 }
    })
      .populate('product')
      .populate('store', 'name');
    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update inventory quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity, reservedQuantity } = req.body;
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        quantity,
        reservedQuantity,
        availableQuantity: quantity - (reservedQuantity || 0),
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    ).populate('product').populate('store', 'name');

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: inventory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add inventory
router.post('/', async (req, res) => {
  try {
    const { store, product, quantity } = req.body;
    
    let inventory = await Inventory.findOne({ store, product });
    
    if (inventory) {
      inventory.quantity += quantity;
      inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;
      await inventory.save();
    } else {
      inventory = new Inventory({
        store,
        product,
        quantity,
        availableQuantity: quantity
      });
      await inventory.save();
    }

    await inventory.populate('product').populate('store', 'name');
    res.status(201).json({
      success: true,
      message: 'Inventory added successfully',
      data: inventory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
