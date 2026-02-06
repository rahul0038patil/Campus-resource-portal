const Resource = require('../models/Resource');
const fs = require('fs');
const path = require('path');

const getResources = async (req, res) => {
    const resources = await Resource.find().populate('user', 'name');
    res.status(200).json(resources);
};

const createResource = async (req, res) => {
    const { title, category, description, type } = req.body;
    let fileUrl = req.body.fileUrl;

    if (req.file) {
        fileUrl = `/uploads/resources/${req.file.filename}`;
    }

    if (!fileUrl) {
        return res.status(400).json({ message: 'Please provide a file or a URL' });
    }

    const resource = await Resource.create({
        user: req.user.id,
        title,
        category,
        description,
        fileUrl,
        type: type || (req.file ? path.extname(req.file.originalname).substring(1).toUpperCase() : 'PDF'),
    });

    res.status(201).json(resource);
};

const deleteResource = async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
    }

    // Check ownership or admin role
    if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }

    // Delete local file if it exists
    if (resource.fileUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', resource.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await resource.deleteOne();
    res.status(200).json({ message: 'Resource removed' });
};

module.exports = {
    getResources,
    createResource,
    deleteResource,
};
