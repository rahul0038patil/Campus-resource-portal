const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Resource = require('./models/Resource');
const Announcement = require('./models/Announcement');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected for seeding...');

        await User.deleteMany();
        await Job.deleteMany();
        await Resource.deleteMany();
        await Announcement.deleteMany();

        // Create Admin
        const admin = await User.create({
            name: 'Rahul Patil',
            email: 'admin@university.edu',
            password: 'password123',
            role: 'admin',
            department: 'Placement Cell'
        });

        // Create Faculty
        const faculty = await User.create({
            name: 'Prof. Rahul Verma',
            email: 'faculty@university.edu',
            password: 'password123',
            role: 'faculty',
            department: 'Computer Science'
        });

        // Create Student
        const student = await User.create({
            name: 'Aryan Kumar',
            email: 'aryan@university.edu',
            password: 'password123',
            role: 'student',
            department: 'IT',
            year: 4,
            skills: ['React', 'Node.js', 'MongoDB']
        });

        // Create Jobs
        await Job.create([]);

        // Create Resources
        await Resource.create([]);

        // Create Announcements
        await Announcement.create([]);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
