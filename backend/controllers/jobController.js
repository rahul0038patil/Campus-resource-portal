const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    const jobs = await Job.find().populate('user', 'name');
    res.status(200).json(jobs);
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('user', 'name');
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Admin only)
const createJob = async (req, res) => {
    const { title, company, location, type, description, requirements, salary, deadline } = req.body;

    const job = await Job.create({
        user: req.user.id,
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary,
        deadline,
    });

    res.status(201).json(job);
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student only)
const applyForJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
        student: req.user.id,
        job: req.params.id,
    });

    if (alreadyApplied) {
        return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = await Application.create({
        student: req.user.id,
        job: req.params.id,
        resume: req.body.resume || req.user.resume,
    });

    job.applications.push(application._id);
    await job.save();

    res.status(201).json(application);
};

const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        await job.deleteOne();
        res.status(200).json({ message: 'Job removed' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    applyForJob,
    deleteJob,
};
