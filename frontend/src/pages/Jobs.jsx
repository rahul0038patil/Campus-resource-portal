import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 max-w-7xl mx-auto px-6 mb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs & Internships</h1>
                        <p className="text-gray-500 text-base">Explore opportunities from top tech companies and startups.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs or companies..."
                                className="w-full pl-12 pr-4 py-3 glass-card rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 italic text-gray-400">Loading opportunities...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job._id} className="glass-card p-6 rounded-xl card-hover flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
                                                <Briefcase size={22} />
                                            </div>
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider italic">
                                                {job.type}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                        <p className="text-primary font-medium mb-4">{job.company}</p>

                                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} /> {job.location || 'Remote'}
                                            </div>
                                            {job.salary && (
                                                <div className="text-emerald-600 font-medium">
                                                    {job.salary}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>

                                    <button className="w-full py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-medium text-sm">
                                        View Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No opportunities found</h3>
                                <p className="text-gray-500 italic mt-2">Check back later for new openings.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Jobs;

