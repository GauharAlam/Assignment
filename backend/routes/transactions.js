const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Membership = require('../models/Membership');
const Member = require('../models/Member');

router.use(auth);

// Add Membership
router.post('/add', async (req, res) => {
    try {
        const { membershipNumber, memberId, eventId, duration, startDate, receiveNotifications } = req.body;
        
        // Calculate end date based on duration
        const start = new Date(startDate || Date.now());
        let end = new Date(start);
        if (duration === '6 months') end.setMonth(end.getMonth() + 6);
        else if (duration === '1 year') end.setFullYear(end.getFullYear() + 1);
        else if (duration === '2 years') end.setFullYear(end.getFullYear() + 2);

        const membership = new Membership({
            membershipNumber,
            memberId,
            eventId,
            duration,
            startDate: start,
            endDate: end,
            receiveNotifications: receiveNotifications === 'Yes' || receiveNotifications === true
        });

        await membership.save();
        res.status(201).json(membership);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Membership by Number (for auto-fill)
router.get('/:number', async (req, res) => {
    try {
        const membership = await Membership.findOne({ membershipNumber: req.params.number })
            .populate('memberId')
            .populate('eventId');
        
        if (!membership) return res.status(404).json({ error: 'Membership not found' });
        res.json(membership);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Membership (Extend or Cancel)
router.patch('/update/:number', async (req, res) => {
    try {
        const { action, duration } = req.body;
        const membership = await Membership.findOne({ membershipNumber: req.params.number });

        if (!membership) return res.status(404).json({ error: 'Membership not found' });

        if (action === 'Cancel') {
            membership.status = 'Cancelled';
        } else if (action === 'Extend') {
            const currentEnd = new Date(membership.endDate);
            const extendDuration = duration || '6 months';
            
            if (extendDuration === '6 months') currentEnd.setMonth(currentEnd.getMonth() + 6);
            else if (extendDuration === '1 year') currentEnd.setFullYear(currentEnd.getFullYear() + 1);
            else if (extendDuration === '2 years') currentEnd.setFullYear(currentEnd.getFullYear() + 2);

            membership.endDate = currentEnd;
            membership.status = 'Active'; // Reactivate if it was cancelled/expired? Maybe.
        }

        await membership.save();
        res.json(membership);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
