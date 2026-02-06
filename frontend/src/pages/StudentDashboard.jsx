import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ProfileCompletion from '../components/ProfileCompletion';
import { Bell, Briefcase, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState({ applied: 0, pending: 0, messages: 0 });
    const [profileCompletion, setProfileCompletion] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [announcementsRes, profileRes] = await Promise.all([
                    api.get('/announcements'),
                    api.get('/profile')
                ]);
                setAnnouncements(announcementsRes.data);
                console.log('Profile data:', profileRes.data);
                console.log('Profile completion:', profileRes.data.profileCompletion);
                setProfileCompletion(profileRes.data.profileCompletion || 0);
            } catch (err) {
                console.error('Error fetching data:', err);
                // If profile fetch fails, set to 0 to show the prompt
                setProfileCompletion(0);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="pt-32 max-w-7xl mx-auto px-6 mb-20">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Howdy, {user?.name}! 👋</h1>
                        <p className="text-gray-500 font-medium">Here's what's happening on campus today.</p>
                    </div>
                </div>

                {/* Profile Completion Prompt */}
                {profileCompletion < 100 && (
                    <div className="glass-card p-6 rounded-lg border-2 border-yellow-200 bg-yellow-50/50 mb-8">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="text-yellow-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Complete Your Profile</h3>
                                    <p className="text-sm text-gray-600">
                                        Your profile is {profileCompletion}% complete. Fill in more details to unlock all features!
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ProfileCompletion percentage={profileCompletion} showLabel={false} size="md" />
                                <Link to={user?.role === 'student' ? "/profile/student" : "/profile/faculty"}>
                                    <button className="btn-primary whitespace-nowrap">
                                        Complete Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats */}
                        {user?.role === 'student' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="glass-card p-6 rounded-lg border-none">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-indigo-50 text-primary rounded-xl"><Briefcase size={18} /></div>
                                        <span className="text-sm font-semibold text-gray-500">Applied</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{stats.applied}</div>
                                </div>
                                <div className="glass-card p-6 rounded-lg border-none">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock size={18} /></div>
                                        <span className="text-sm font-semibold text-gray-500">Pending</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
                                </div>
                                <div className="glass-card p-6 rounded-lg border-none">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={18} /></div>
                                        <span className="text-sm font-semibold text-gray-500">Accepted</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">0</div>
                                </div>
                            </div>
                        )}

                        {/* Recent Announcements */}
                        <div className="glass-card p-8 rounded-lg border-none">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">Recent Announcements</h3>
                                <Bell className="text-gray-300" size={20} />
                            </div>
                            <div className="space-y-6">
                                {announcements.length > 0 ? announcements.map((ann) => (
                                    <div key={ann._id} className="flex gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="w-2 h-auto rounded-full bg-primary/20 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">{ann.title}</h4>
                                            <p className="text-gray-500 text-sm italic leading-relaxed mb-3">{ann.content}</p>
                                            <div className="text-[10px] font-bold text-primary tracking-widest uppercase">
                                                {new Date(ann.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <Bell size={32} />
                                        </div>
                                        <div className="text-gray-400 font-medium italic text-sm">No recent announcements from campus.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-lg bg-dark border-none">
                            <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <div className="text-white/50 text-sm italic">No upcoming events scheduled.</div>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all text-sm font-semibold">View All Events</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

