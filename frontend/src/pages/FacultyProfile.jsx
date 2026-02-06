import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, GraduationCap, Briefcase, Link as LinkIcon, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCompletion from '../components/ProfileCompletion';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const FacultyProfile = () => {
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
        designation: '',
        qualification: '',
        experience: '',
        employeeId: '',
        researchInterests: [],
        publications: [],
        specialization: '',
        officeRoom: '',
        officeHours: '',
        linkedin: '',
        profileCompletion: 0
    });

    const [researchInput, setResearchInput] = useState('');
    const [publicationInput, setPublicationInput] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            console.log('Fetched faculty profile data:', data);
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                department: data.department || '',
                designation: data.designation || '',
                qualification: data.qualification || '',
                experience: data.experience || '',
                employeeId: data.employeeId || '',
                researchInterests: data.researchInterests || [],
                publications: data.publications || [],
                specialization: data.specialization || '',
                officeRoom: data.officeRoom || '',
                officeHours: data.officeHours || '',
                linkedin: data.linkedin || '',
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

    const handleAddResearch = (e) => {
        e.preventDefault();
        if (researchInput.trim() && !profile.researchInterests.includes(researchInput.trim())) {
            setProfile({ ...profile, researchInterests: [...profile.researchInterests, researchInput.trim()] });
            setResearchInput('');
        }
    };

    const handleRemoveResearch = (item) => {
        setProfile({ ...profile, researchInterests: profile.researchInterests.filter(r => r !== item) });
    };

    const handleAddPublication = (e) => {
        e.preventDefault();
        if (publicationInput.trim() && !profile.publications.includes(publicationInput.trim())) {
            setProfile({ ...profile, publications: [...profile.publications, publicationInput.trim()] });
            setPublicationInput('');
        }
    };

    const handleRemovePublication = (item) => {
        setProfile({ ...profile, publications: profile.publications.filter(p => p !== item) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const { data } = await api.put('/profile', profile);
            setProfile({
                ...data,
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                researchInterests: data.researchInterests || [],
                publications: data.publications || []
            });
            setShowSuccessModal(true);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setMessage(`Error: ${errorMsg}`);
            console.error('Error updating profile:', error);
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
                    className="bg-white rounded-xl shadow-sm p-8 mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Profile</h1>
                            <p className="text-gray-500">Complete your profile to enhance your presence</p>
                        </div>
                        <ProfileCompletion percentage={profile.profileCompletion} size="lg" />
                    </div>
                </motion.div>

                {/* Success Message */}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
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

                    {/* Professional Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Briefcase className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Professional Details</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={profile.designation}
                                    onChange={handleChange}
                                    placeholder="e.g., Assistant Professor"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={profile.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g., Ph.D. in Computer Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={profile.experience}
                                    onChange={handleChange}
                                    placeholder="e.g., 10"
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={profile.employeeId}
                                    onChange={handleChange}
                                    placeholder="e.g., FAC2021001"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Academic & Research */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-8 mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <BookOpen className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Academic & Research</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={profile.specialization}
                                    onChange={handleChange}
                                    placeholder="e.g., Machine Learning, Data Science"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            {/* Research Interests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Research Interests</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={researchInput}
                                        onChange={(e) => setResearchInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddResearch(e)}
                                        placeholder="Add research interest"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddResearch}
                                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.researchInterests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveResearch(interest)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Publications */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Publications</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={publicationInput}
                                        onChange={(e) => setPublicationInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddPublication(e)}
                                        placeholder="Add publication title or link"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddPublication}
                                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {profile.publications.map((pub, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 bg-gray-50 rounded-xl text-sm flex items-center justify-between"
                                        >
                                            <span className="text-gray-700">{pub}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePublication(pub)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact & Office */}
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
                            <h2 className="text-xl font-bold text-gray-900">Contact & Office</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Office Room</label>
                                <input
                                    type="text"
                                    name="officeRoom"
                                    value={profile.officeRoom}
                                    onChange={handleChange}
                                    placeholder="e.g., Room 301, CS Block"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                                <input
                                    type="text"
                                    name="officeHours"
                                    value={profile.officeHours}
                                    onChange={handleChange}
                                    placeholder="e.g., Mon-Fri, 2-4 PM"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
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
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
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

export default FacultyProfile;

