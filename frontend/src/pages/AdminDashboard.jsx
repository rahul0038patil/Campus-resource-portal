import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus, Users, Briefcase, FileText, Trash2, Megaphone, CheckCircle, ExternalLink, Download } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [data, setData] = useState({
        jobs: [],
        users: [],
        resources: [],
        announcements: [],
        applications: []
    });
    const [loading, setLoading] = useState(true);
    const [showAddJob, setShowAddJob] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '', company: '', location: '', type: 'Full-time', description: '', salary: '', deadline: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, usersRes, resourcesRes, announcementsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/auth'),
                api.get('/resources'),
                api.get('/announcements')
            ]);
            setData({
                jobs: jobsRes.data,
                users: usersRes.data,
                resources: resourcesRes.data,
                announcements: announcementsRes.data,
                applications: [] // Placeholder for future enhancement
            });
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            let endpoint = '';
            if (type === 'user') endpoint = `/auth/${id}`;
            else if (type === 'job') endpoint = `/jobs/${id}`;
            else if (type === 'resource') endpoint = `/resources/${id}`;
            else if (type === 'announcement') endpoint = `/announcements/${id}`;

            await api.delete(endpoint);
            fetchData(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting item');
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', newJob);
            setShowAddJob(false);
            setNewJob({ title: '', company: '', location: '', type: 'Full-time', description: '', salary: '', deadline: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <Navbar />
            <div className="pt-32 max-w-7xl mx-auto px-6 mb-20 flex-grow w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1 font-outfit uppercase tracking-tight">Admin Control Panel</h1>
                        <p className="text-gray-500 font-medium italic text-sm">Welcome back, Administrator. Full system oversight is active.</p>
                    </div>
                    <button
                        onClick={() => setShowAddJob(!showAddJob)}
                        className="btn-primary flex items-center gap-2 rounded-2xl bg-black hover:bg-black/90 text-white px-6 py-3 transition-all"
                    >
                        <Plus size={20} /> Post New Job
                    </button>
                </div>

                {/* Analytics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Users', value: data.users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Jobs Live', value: data.jobs.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Study Resources', value: data.resources.length, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Announcements', value: data.announcements.length, icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-xl border-none shadow-sm bg-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={20} /></div>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="text-4xl font-black text-gray-900">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {['jobs', 'users', 'resources', 'announcements'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab
                                ? 'bg-black text-white shadow-xl shadow-black/10'
                                : 'bg-white text-gray-400 hover:text-black hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {showAddJob && (
                    <div className="glass-card p-8 rounded-lg mb-12 border-none bg-white shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Create Job Posting</h3>
                        <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                placeholder="Job Title" required
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                            />
                            <input
                                placeholder="Company Name" required
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                            />
                            <select
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <input
                                placeholder="Salary Range"
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                            />
                            <textarea
                                placeholder="Job Description" required className="md:col-span-2 w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 h-32 transition-all"
                                value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            ></textarea>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowAddJob(false)} className="px-8 py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                                <button type="submit" className="bg-black text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-black/90">Publish Posting</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Content Area */}
                <div className="glass-card rounded-lg overflow-hidden border-none bg-white shadow-sm min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-400 italic font-medium">
                            <div className="animate-spin mb-4"><Plus size={24} /></div>
                            Synchronizing System Data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {activeTab === 'users' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identity</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rank</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-gray-900 text-base">{user.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium italic">{user.email}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest italic ${user.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                            user.role === 'faculty' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                                        }`}>{user.role}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {user.role !== 'admin' && (
                                                        <button onClick={() => handleDelete('user', user._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'jobs' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Opportunity</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organization</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.jobs.length > 0 ? data.jobs.map((job) => (
                                            <tr key={job._id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-gray-900">{job.title}</div>
                                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{job.type}</div>
                                                </td>
                                                <td className="px-8 py-6 text-gray-500 font-semibold">{job.company}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => handleDelete('job', job._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="px-8 py-20 text-center text-gray-400 italic">No job postings detected.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'resources' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Uploader</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.resources.length > 0 ? data.resources.map((res) => (
                                            <tr key={res._id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-gray-900">{res.title}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{res.category}</span>
                                                        <span className="text-[9px] font-black text-gray-400 border border-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{res.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-gray-500 font-medium">{res.user?.name || 'Academic System'}</td>
                                                <td className="px-8 py-6 text-right flex justify-end gap-2">
                                                    <a href={res.fileUrl.startsWith('/') ? `http://localhost:5000${res.fileUrl}` : res.fileUrl} target="_blank" rel="noreferrer" className="p-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                                                        <ExternalLink size={18} />
                                                    </a>
                                                    <button onClick={() => handleDelete('resource', res._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="px-8 py-20 text-center text-gray-400 italic">No academic resources found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'announcements' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Notice</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.announcements.length > 0 ? data.announcements.map((ann) => (
                                            <tr key={ann._id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-gray-900">{ann.title}</div>
                                                    <div className="text-xs text-gray-400 mt-1 italic line-clamp-1">{ann.content}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {ann.isUrgent ? (
                                                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black rounded-full uppercase tracking-widest italic animate-pulse">Urgent</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[9px] font-black rounded-full uppercase tracking-widest italic font-bold">Standard</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => handleDelete('announcement', ann._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="px-8 py-20 text-center text-gray-400 italic">No official announcements discovered.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;

