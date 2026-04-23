const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    membershipNumber: {
        type: String,
        required: true,
        unique: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    duration: {
        type: String,
        enum: ['6 months', '1 year', '2 years'],
        default: '6 months',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Expired'],
        default: 'Active'
    },
    receiveNotifications: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
