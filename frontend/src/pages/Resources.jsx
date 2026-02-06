import React, { useState, useEffect, useContext } from 'react';
import { Search, BookOpen, Download, ExternalLink, Filter, Plus, X, Trash2, FileText, Upload } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Resources = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [showUpload, setShowUpload] = useState(false);

    const [uploadData, setUploadData] = useState({
        title: '',
        category: 'Study Material',
        description: '',
        file: null,
        fileUrl: '',
        type: 'PDF'
    });

    const fetchResources = async () => {
        try {
            const { data } = await api.get('/resources');
            setResources(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('category', uploadData.category);
        formData.append('description', uploadData.description);
        formData.append('type', uploadData.type);
        if (uploadData.file) {
            formData.append('file', uploadData.file);
        } else {
            formData.append('fileUrl', uploadData.fileUrl);
        }

        try {
            await api.post('/resources', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowUpload(false);
            setUploadData({ title: '', category: 'Study Material', description: '', file: null, fileUrl: '', type: 'PDF' });
            fetchResources();
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await api.delete(`/resources/${id}`);
            fetchResources();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const categories = ['All', 'PDF', 'Video', 'Document', 'Link'];
    const filteredResources = category === 'All'
        ? resources
        : resources.filter(r => r.type === category);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 max-w-7xl mx-auto px-6 mb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Library</h1>
                        <p className="text-gray-500 italic">Access study materials, interview prep, and faculty notes.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${category === cat
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {(user?.role === 'faculty' || user?.role === 'admin') && (
                            <button
                                onClick={() => setShowUpload(true)}
                                className="btn-primary flex items-center gap-2 rounded-2xl"
                            >
                                <Plus size={20} /> Post Resource
                            </button>
                        )}
                    </div>
                </div>

                {/* Upload Modal */}
                {showUpload && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                        <div className="glass-card w-full max-w-xl p-8 rounded-lg border-none">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Add New Resource</h3>
                                <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <input
                                    placeholder="Resource Title" required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                    value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                        value={uploadData.type} onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input
                                        placeholder="Category (e.g. Maths, CSE)" required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                        value={uploadData.category} onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    placeholder="Brief Description"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 h-24"
                                    value={uploadData.description} onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                />

                                <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl">
                                    {uploadData.type === 'Link' ? (
                                        <input
                                            placeholder="External URL (https://...)" required
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                                            value={uploadData.fileUrl} onChange={(e) => setUploadData({ ...uploadData, fileUrl: e.target.value })}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <Upload className="text-gray-400" size={24} />
                                            <input
                                                type="file" required
                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="w-full btn-primary py-4 rounded-2xl font-bold border-none shadow-indigo-100">
                                    Publish Resource
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64 italic text-gray-400">Fetching library...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredResources.length > 0 ? (
                            filteredResources.map((res) => (
                                <div key={res._id} className="glass-card p-6 rounded-xl card-hover border-none flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
                                            <FileText size={20} />
                                        </div>
                                        {(user?.role === 'admin' || user?._id === res.user?._id) && (
                                            <button onClick={() => handleDelete(res._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mb-4 flex-grow">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{res.category}</span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">{res.title}</h3>
                                        <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed italic">
                                            {res.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-gray-400 text-[10px] mb-4 font-medium">
                                            Added by <span className="text-gray-900">{res.user?.name || 'Faculty Member'}</span>
                                        </p>
                                        <a
                                            href={res.fileUrl.startsWith('/') ? `http://localhost:5000${res.fileUrl}` : res.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-primary/5 rounded-xl text-gray-700 hover:text-primary transition-all text-xs font-bold group"
                                        >
                                            {res.type === 'Link' ? 'Visit URL' : 'Download File'}
                                            {res.type === 'Link' ? <ExternalLink size={14} className="group-hover:scale-110" /> : <Download size={14} className="group-hover:translate-y-0.5" />}
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No resources found</h3>
                                <p className="text-gray-500 italic mt-2">Try adjusting your filters or check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Resources;

