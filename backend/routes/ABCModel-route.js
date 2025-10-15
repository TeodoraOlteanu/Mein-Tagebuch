const express = require('express');
const router = express.Router();
const ABC = require('../models/ABCModel');  // Adjust the path as necessary
const authenticate = require('../authenticate')

router.post('/abc', authenticate, async (req, res) => {
    try {
        const newABC = new ABC({
            ...req.body,
            user: req.user._id // Use the authenticated user's ID
          });
        await newABC.save();
        res.status(201).send(newABC);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Fetch all ABC models for a user
router.get('/abc', authenticate, async (req, res) => {
    try {
        const abcs = await ABC.find({ user: req.user._id }); // Find all ABCs by user ID
        res.json(abcs);
    } catch (error) {
        console.error('Failed to retrieve ABCs:', error);
        res.status(500).send('Error retrieving ABC entries');
    }
});

// API Route for ABCDetails
router.get('/abc/:abcId', authenticate, async (req, res) => {
    try {
        const abc = await ABC.findById(req.params.abcId);
        if (!abc) {
            return res.status(404).send('ABC entry not found');
        }
        res.json(abc);
    } catch (error) {
        console.error('Error retrieving ABC entry:', error);
        res.status(500).send('Server error');
    }
  });

  // Update an ABC model by ID
router.put('/abc/:abcId', authenticate, async (req, res) => {
    try {
        const { name, ...updateData } = req.body;
        
        // Check if the new name already exists
        const existingABC = await ABC.findOne({ name, user: req.user._id, _id: { $ne: req.params.abcId } });
        if (existingABC) {
            return res.status(400).send('Name already exists');
        }

        const updatedABC = await ABC.findOneAndUpdate(
            { _id: req.params.abcId, user: req.user._id },
            { name, ...updateData },
            { new: true }
        );

        if (!updatedABC) {
            return res.status(404).send('ABC model not found');
        }

        res.send(updatedABC);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Delete an ABC model by ID
router.delete('/abc/:abcId', authenticate, async (req, res) => {
    try {
        const deletedABC = await ABC.findOneAndDelete({ _id: req.params.abcId, user: req.user._id });
        if (!deletedABC) {
            return res.status(404).send('ABC model not found');
        }
        res.send('ABC model deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

