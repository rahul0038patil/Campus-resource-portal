const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, department, year, skills } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
        department,
        year,
        skills,
    });

    if (user) {
        // Calculate initial profile completion
        user.profileCompletion = user.calculateProfileCompletion();
        await user.save();

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileCompletion: user.profileCompletion,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    // Check for user email
    const user = await User.findOne({ email: cleanEmail });

    if (user && (await user.matchPassword(password))) {
        // Calculate profile completion if not set
        if (user.profileCompletion === undefined || user.profileCompletion === null) {
            user.profileCompletion = user.calculateProfileCompletion();
            await user.save();
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileCompletion: user.profileCompletion,
            token: generateToken(user._id),
        });
    } else {
        console.log(`Login failed for email: ${cleanEmail}. User found: ${!!user}`);
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all users
// @route   GET /api/auth
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
};

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    deleteUser,
};
