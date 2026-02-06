const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        description: String,
        fileUrl: {
            type: String,
            required: [true, 'Please add a file URL'],
        },
        type: {
            type: String,
            enum: ['PDF', 'Video', 'Link', 'Document'],
            default: 'PDF',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Resource', resourceSchema);
