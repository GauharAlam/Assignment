const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Membership = require('../models/Membership');
const User = require('../models/User');

router.use(auth);

// List of Memberships
router.get('/memberships', async (req, res) => {
    try {
        const memberships = await Membership.find()
            .populate('memberId', 'name email')
            .populate('eventId', 'name date');
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List of Users (Admin might want this, or just a general report)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'email role createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
