const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Job',
        },
        resume: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
            default: 'Pending',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Application', applicationSchema);
