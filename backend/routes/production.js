const express = require('express');
const router = express.Router();
const ProductionData = require('../models/ProductionData');

// Get all production data
router.get('/', async (req, res) => {
  try {
    const data = await ProductionData.find().sort({ dates: -1 });
    console.log('Fetched production data count:', data.length);
    res.json(data);
  } catch (err) {
    console.error('Error fetching production data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add production data
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    console.log('Received production data:', data);
    
    const prod = new ProductionData(data);
    const savedProd = await prod.save();
    console.log('Saved production data:', savedProd);
    
    res.status(201).json(savedProd);
  } catch (err) {
    console.error('Error saving production data:', err);
    res.status(400).json({ error: err.message });
  }
});

// Edit production data by date
router.put('/:dates', async (req, res) => {
  try {
    const { dates } = req.params;
    const updated = await ProductionData.findOneAndUpdate({ dates }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get sum of detail_value where main_detail = 'By Employee'
router.get('/sum/by-employee', async (req, res) => {
  try {
    const result = await ProductionData.aggregate([
      { $match: { main_detail: 'By Employee' } },
      { $group: { _id: null, total_value: { $sum: '$detail_value' } } }
    ]);
    const totalSum = result[0]?.total_value || 0;
    const remainingProduction = totalSum * 160;
    res.json({ totalSum, remainingProduction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete production data by date
router.delete('/:dates', async (req, res) => {
  try {
    const { dates } = req.params;
    await ProductionData.findOneAndDelete({ dates });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 