const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
    const announcements = await Announcement.find().populate('user', 'name');
    res.status(200).json(announcements);
};

const createAnnouncement = async (req, res) => {
    const { title, content, type, eventDate, isUrgent } = req.body;

    const announcement = await Announcement.create({
        user: req.user.id,
        title,
        content,
        type,
        eventDate,
        isUrgent,
    });

    res.status(201).json(announcement);
};

const deleteAnnouncement = async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        await announcement.deleteOne();
        res.status(200).json({ message: 'Announcement removed' });
    } else {
        res.status(404).json({ message: 'Announcement not found' });
    }
};

module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
};
