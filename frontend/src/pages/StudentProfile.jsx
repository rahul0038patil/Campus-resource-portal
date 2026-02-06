import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, GraduationCap, Briefcase, MapPin, Link as LinkIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCompletion from '../components/ProfileCompletion';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const StudentProfile = () => {
    const { user: authUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        department: '',
        year: '',
        semester: '',
        enrollmentNumber: '',
        cgpa: '',
        skills: [],
        bio: '',
        portfolioUrl: '',
        linkedin: '',
        github: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        profileCompletion: 0
    });

    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            console.log('Fetched profile data:', data);
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                department: data.department || '',
                year: data.year || '',
                semester: data.semester || '',
                enrollmentNumber: data.enrollmentNumber || '',
                cgpa: data.cgpa || '',
                skills: data.skills || [],
                bio: data.bio || '',
                portfolioUrl: data.portfolioUrl || '',
                linkedin: data.linkedin || '',
                github: data.github || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                profileImage: data.profileImage || '',
                resume: data.resume || '',
                profileCompletion: data.profileCompletion || 0
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
            setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const [profileImage, setProfileImage] = useState(null);
    const [resume, setResume] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.name === 'profileImage') {
            setProfileImage(e.target.files[0]);
        } else if (e.target.name === 'resume') {
            setResume(e.target.files[0]);
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile({ ...profile, skills: profile.skills.filter(skill => skill !== skillToRemove) });
    };

    // Calculate missing fields to guide user
    const getMissingFields = () => {
        const missing = [];
        const requiredFields = [
            { key: 'profileImage', label: 'Profile Image' },
            { key: 'resume', label: 'Resume' },
            { key: 'linkedin', label: 'LinkedIn' },
            { key: 'github', label: 'GitHub' },
            { key: 'portfolioUrl', label: 'Portfolio' },
            { key: 'bio', label: 'Bio' },
            { key: 'skills', label: 'Skills' },
            { key: 'address', label: 'Address' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'pincode', label: 'Pincode' },
            { key: 'year', label: 'Year' },
            { key: 'semester', label: 'Semester' },
            { key: 'enrollmentNumber', label: 'Enrollment No.' },
            { key: 'cgpa', label: 'CGPA' },
            { key: 'department', label: 'Department' },
            { key: 'dateOfBirth', label: 'Date of Birth' },
            { key: 'phone', label: 'Phone' }
        ];

        requiredFields.forEach(field => {
            const value = profile[field.key];
            if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                missing.push(field.label);
            }
        });

        return missing;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const formData = new FormData();

        // Append all text fields
        Object.keys(profile).forEach(key => {
            if (key === 'skills') {
                formData.append('skills', JSON.stringify(profile.skills));
            } else if (key !== 'profileCompletion' && profile[key] !== null) {
                formData.append(key, profile[key]);
            }
        });

        // Append files if selected
        if (profileImage) formData.append('profileImage', profileImage);
        if (resume) formData.append('resume', resume);

        try {
            const { data } = await api.put('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile({
                ...data,
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                skills: data.skills || []
            });
            // Reset file inputs
            setProfileImage(null);
            setResume(null);
            // Show success modal instead of just setting message
            setShowSuccessModal(true);

            // Auto hide message after delay if needed, but modal handles it now
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.message || error.message;
            setMessage(`Error: ${errorMsg}`);
            alert(`Failed to update profile: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-32">
                {/* Header with Profile Completion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
                            <p className="text-warm-600">Let's complete your profile together</p>
                        </div>
                        <ProfileCompletion percentage={profile.profileCompletion} size="lg" />
                    </div>
                    {/* Missing Fields Indicator */}
                    {profile.profileCompletion < 100 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <h3 className="text-sm font-bold text-yellow-800 mb-2">Complete your profile to reach 100%:</h3>
                            <div className="flex flex-wrap gap-2">
                                {getMissingFields().map((field, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                        {field}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Success Message (keeping for error display if any) */}
                {message && !message.includes('success') && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200`}
                    >
                        {message}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <User className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        </div>

                        <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                {profile.profileImage && !profileImage && <span className="text-xs text-green-600">Current image set</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="+91 1234567890"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={profile.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Academic Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <GraduationCap className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Academic Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    placeholder="e.g., Computer Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <select
                                    name="year"
                                    value={profile.year}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                                <select
                                    name="semester"
                                    value={profile.semester}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                >
                                    <option value="">Select Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Number</label>
                                <input
                                    type="text"
                                    name="enrollmentNumber"
                                    value={profile.enrollmentNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., 2021CS001"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={profile.cgpa}
                                    onChange={handleChange}
                                    placeholder="e.g., 8.5"
                                    min="0"
                                    max="10"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Professional Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Briefcase className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Professional Details</h2>
                        </div>

                        <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                {profile.resume && !resume && <span className="text-xs text-green-600">Current resume set</span>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">Skills</label>
                                <p className="text-xs text-warm-500 mb-2">Add your skills one at a time</p>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                                        placeholder="Add a skill (e.g., React, Python)"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <LinkIcon className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Links & Portfolio</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                                <input
                                    type="url"
                                    name="portfolioUrl"
                                    value={profile.portfolioUrl}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={profile.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={profile.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/yourusername"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <MapPin className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Address</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder="123 Main Street"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={profile.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={profile.pincode}
                                    onChange={handleChange}
                                    placeholder="123456"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </motion.div>
                </form>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Updated!</h3>
                            <p className="text-gray-500 mb-8">Your profile information has been successfully saved.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full btn-primary py-3 rounded-xl font-semibold"
                            >
                                Continue
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default StudentProfile;

