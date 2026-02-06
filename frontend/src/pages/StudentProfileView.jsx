import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, MapPin, Link as LinkIcon, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCompletion from '../components/ProfileCompletion';
import api from '../utils/api';

const StudentProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get(`/profile/${id}`);
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-bold">Student not found</h2>
                <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 text-primary">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <p className="text-gray-900 font-medium break-all">{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-32">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Students
                </button>

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
                        <div className="w-32 h-32 rounded-xl bg-white p-2 shadow-lg">
                            <div className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center text-4xl font-bold text-primary">
                                {profile.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                                <GraduationCap size={16} />
                                {profile.department} • {profile.year ? `${profile.year} Year` : 'N/A'}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ProfileCompletion percentage={profile.profileCompletion || 0} size="md" />
                            <span className="text-xs font-semibold text-gray-400">Profile Completion</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Personal Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg p-8 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <User className="text-primary" /> Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={Mail} label="Email" value={profile.email} />
                                <InfoItem icon={Phone} label="Phone" value={profile.phone} />
                                <InfoItem icon={Calendar} label="Date of Birth" value={profile.dateOfBirth?.split('T')[0]} />
                                <InfoItem icon={MapPin} label="Location" value={profile.city ? `${profile.city}, ${profile.state}` : ''} />
                            </div>
                            {profile.address && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Full Address</p>
                                    <p className="text-gray-900">{profile.address}, {profile.pincode}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Academic Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-lg p-8 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <GraduationCap className="text-primary" /> Academic Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={GraduationCap} label="Course/Dept" value={profile.department} />
                                <InfoItem icon={User} label="Enrollment No." value={profile.enrollmentNumber} />
                                <InfoItem icon={Calendar} label="Current Semester" value={profile.semester} />
                                <InfoItem icon={Briefcase} label="CGPA" value={profile.cgpa} />
                            </div>
                        </motion.div>

                        {/* Bio */}
                        {profile.bio && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-lg p-8 shadow-sm"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Skills */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-lg p-8 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Briefcase className="text-primary" /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <span key={index} className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No skills added yet.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-lg p-8 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <LinkIcon className="text-primary" /> Portfolio & Links
                            </h2>
                            <div className="space-y-4">
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                                        <LinkIcon size={18} /> LinkedIn Profile
                                    </a>
                                )}
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors">
                                        <LinkIcon size={18} /> GitHub Profile
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-colors">
                                        <LinkIcon size={18} /> Personal Portfolio
                                    </a>
                                )}
                                {!profile.linkedin && !profile.github && !profile.portfolioUrl && (
                                    <p className="text-gray-500 italic">No links provided.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentProfileView;

