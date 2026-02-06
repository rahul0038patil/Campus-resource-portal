const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin only)
const getApplications = async (req, res) => {
    const applications = await Application.find({})
        .populate('student', 'name email department year')
        .populate('job', 'title company');
    res.status(200).json(applications);
};

// @desc    Get logged in user applications
// @route   GET /api/applications/my
// @access  Private (Student only)
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ student: req.user._id })
        .populate('job', 'title company location type');
    res.status(200).json(applications);
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Admin only)
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (application) {
        application.status = status;
        await application.save();
        res.status(200).json(application);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
const deleteApplication = async (req, res) => {
    const application = await Application.findById(req.params.id);

    if (application) {
        // Also remove from Job applications array
        await Job.updateOne(
            { _id: application.job },
            { $pull: { applications: application._id } }
        );

        await application.deleteOne();
        res.status(200).json({ message: 'Application removed' });
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

module.exports = {
    getApplications,
    getMyApplications,
    updateApplicationStatus,
    deleteApplication,
};
