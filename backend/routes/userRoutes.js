const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this is the correct path to your User model
const authenticate = require('../authenticate.js'); // Ensure this is the correct path to your authentication middleware
const bcrypt = require('bcryptjs');
const ABC = require('../models/ABCModel'); // Ensure this is the correct path to your ABC model


// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).send('Server error');
    }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server error');
    }
});

// Delete user and associated ABC models
router.delete('/profile', authenticate, async (req, res) => {
    try {
        console.log('Deleting user:', req.user._id); // Add logging
        // Find and delete the user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Delete all ABC models associated with the user
        const deleteResult = await ABC.deleteMany({ user: req.user._id });
        console.log('ABC models deleted:', deleteResult); // Add logging

        // Delete the user
        const userDeleteResult = await User.findByIdAndDelete(req.user._id);
        console.log('User deleted:', userDeleteResult); // Add logging

        res.send('Account deleted successfully');
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
