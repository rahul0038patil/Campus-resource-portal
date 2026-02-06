const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate and update profile completion
        try {
            const completion = user.calculateProfileCompletion();
            if (user.profileCompletion !== completion) {
                user.profileCompletion = completion;
                await user.save();
            }
        } catch (calcError) {
            console.error('Error calculating profile completion:', calcError);
            // Set to 0 if calculation fails
            user.profileCompletion = 0;
        }

        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle File Uploads
        if (req.files) {
            if (req.files.profileImage) {
                // Store relative path
                user.profileImage = req.files.profileImage[0].path.replace(/\\/g, '/');
            }
            if (req.files.resume) {
                user.resume = req.files.resume[0].path.replace(/\\/g, '/');
            }
        }

        // Update allowed fields based on role
        const allowedFields = [
            'phone', 'dateOfBirth', 'department',
            // Student fields
            'year', 'semester', 'enrollmentNumber', 'cgpa', 'skills',
            'bio', 'portfolioUrl', 'linkedin', 'github',
            'address', 'city', 'state', 'pincode',
            // Faculty fields
            'designation', 'qualification', 'experience', 'employeeId',
            'researchInterests', 'publications', 'specialization',
            'officeRoom', 'officeHours'
        ];

        // Update only the fields that are provided in the request
        const numericFields = ['year', 'semester', 'cgpa', 'experience'];
        const dateFields = ['dateOfBirth'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                let value = req.body[field];

                // Parse JSON strings for array fields (FormData sends arrays as strings)
                if (['skills', 'researchInterests', 'publications'].includes(field) && typeof value === 'string') {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        // If parse fails, try comma separation or keep original
                        if (value.includes(',')) {
                            value = value.split(',').map(s => s.trim());
                        }
                    }
                }

                // Handle empty strings for Number and Date fields to avoid CastError
                if (value === '') {
                    if (numericFields.includes(field) || dateFields.includes(field)) {
                        value = null;
                    }
                }

                user[field] = value;
            }
        });

        // Recalculate profile completion
        user.profileCompletion = user.calculateProfileCompletion();

        const updatedUser = await user.save();

        // Return user without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students (for faculty/admin)
// @route   GET /api/profile/students
// @access  Private (Faculty/Admin)
const getAllStudents = async (req, res) => {
    try {
        // ideally check if req.user.role is faculty or admin
        if (req.user.role === 'student') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const students = await User.find({ role: 'student' })
            .select('name email studentId profileCompletion department year section') // Adjust fields as needed
            .sort({ name: 1 });

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific user profile by ID
// @route   GET /api/profile/:id
// @access  Private (Faculty/Admin)
const getUserProfile = async (req, res) => {
    try {
        // ideally check if req.user.role is faculty or admin
        if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllStudents,
    getUserProfile
};
