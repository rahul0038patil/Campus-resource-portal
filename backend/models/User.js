const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        // Basic Information (Common)
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['student', 'admin', 'faculty'],
            default: 'student',
        },
        phone: String,
        dateOfBirth: Date,
        profileImage: String,

        // Common Academic
        department: String,

        // Student-specific fields
        year: Number,
        semester: Number,
        enrollmentNumber: String,
        cgpa: Number,
        skills: [String],
        resume: String,
        bio: String,
        portfolioUrl: String,
        linkedin: String,
        github: String,
        address: String,
        city: String,
        state: String,
        pincode: String,

        // Faculty-specific fields
        designation: String,
        qualification: String,
        experience: Number, // years
        employeeId: String,
        researchInterests: [String],
        publications: [String],
        specialization: String,
        officeRoom: String,
        officeHours: String,

        // Profile Completion
        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage based on role
userSchema.methods.calculateProfileCompletion = function () {
    let totalFields = 0;
    let filledFields = 0;

    // Common fields for all roles
    const commonFields = ['name', 'email', 'phone', 'dateOfBirth', 'department', 'profileImage'];

    if (this.role === 'student') {
        const studentFields = [
            ...commonFields,
            'year', 'semester', 'enrollmentNumber', 'cgpa', 'skills',
            'resume', 'bio', 'portfolioUrl', 'linkedin', 'github',
            'address', 'city', 'state', 'pincode'
        ];

        totalFields = studentFields.length;
        studentFields.forEach(field => {
            const value = this[field];
            if (value !== undefined && value !== null && value !== '' &&
                !(Array.isArray(value) && value.length === 0)) {
                filledFields++;
            }
        });
    } else if (this.role === 'faculty') {
        const facultyFields = [
            ...commonFields,
            'designation', 'qualification', 'experience', 'employeeId',
            'researchInterests', 'publications', 'specialization',
            'officeRoom', 'officeHours', 'linkedin'
        ];

        totalFields = facultyFields.length;
        facultyFields.forEach(field => {
            const value = this[field];
            if (value !== undefined && value !== null && value !== '' &&
                !(Array.isArray(value) && value.length === 0)) {
                filledFields++;
            }
        });
    } else {
        // Admin or other roles - just use common fields
        totalFields = commonFields.length;
        commonFields.forEach(field => {
            const value = this[field];
            if (value !== undefined && value !== null && value !== '') {
                filledFields++;
            }
        });
    }

    return Math.round((filledFields / totalFields) * 100);
};

module.exports = mongoose.model('User', userSchema);
