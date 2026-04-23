const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ user: { email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Seed Route (For testing/initial setup)
router.post('/seed', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'Admin' });
        if (adminExists) return res.status(400).json({ message: 'Seed already performed' });

        const admin = new User({
            email: 'admin@ems.com',
            password: 'adminpassword',
            role: 'Admin'
        });

        const user = new User({
            email: 'user@ems.com',
            password: 'userpassword',
            role: 'User'
        });

        await admin.save();
        await user.save();

        res.json({ message: 'Users seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
