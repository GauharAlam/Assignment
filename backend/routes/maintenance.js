const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Event = require('../models/Event');
const Member = require('../models/Member');

// All maintenance routes are Admin only
router.use(auth, authorize('Admin'));

// Event Management
router.get('/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

router.post('/events', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
});

// Member Management
router.get('/members', async (req, res) => {
    const members = await Member.find();
    res.json(members);
});

router.post('/members', async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/members/:id', async (req, res) => {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
});

module.exports = router;
