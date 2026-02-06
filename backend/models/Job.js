const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a job title'],
        },
        company: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        location: String,
        type: {
            type: String,
            enum: ['Full-time', 'Internship', 'Part-time'],
            default: 'Full-time',
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        requirements: [String],
        salary: String,
        deadline: Date,
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
