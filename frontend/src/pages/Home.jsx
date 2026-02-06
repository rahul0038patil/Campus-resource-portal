import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, BookOpen, Bell, ShieldCheck, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card p-6 rounded-xl card-hover"
    >
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
);

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 inline-block">
                            Complete Campus Ecosystem
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            Your Campus,
                            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"> Simplified</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-warm-600 max-w-2xl mx-auto mb-8">
                            Find opportunities, access resources, and stay connected. Everything you need for your college journey, all in one place.
                        </p>
                        {!user && (
                            <div className="mb-6 max-w-xl mx-auto">
                                <p className="text-base text-warm-700 bg-primary/5 border border-primary/15 rounded-xl px-5 py-3 flex items-center justify-center gap-2">
                                    <ShieldCheck size={18} className="text-primary" />
                                    <span className="font-medium">Sign in to unlock exclusive opportunities</span>
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <>
                                    <Link to="/jobs">
                                        <button className="btn-primary flex items-center gap-2 group">
                                            Explore Jobs <Briefcase size={18} />
                                        </button>
                                    </Link>
                                    <Link to="/resources">
                                        <button className="btn-secondary flex items-center gap-2">
                                            View Resources <BookOpen size={18} />
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <button className="btn-primary flex items-center gap-2 group">
                                            Student Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <Link to="/login">
                                        <button className="btn-secondary flex items-center gap-2">
                                            Faculty Access <BookOpen size={18} />
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Hero Illustration */}
                        <div className="hidden lg:block mt-12">
                            <img src="/illustration-hero.svg" alt="Students collaborating" className="w-full max-w-md mx-auto" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y border-gray-50 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Students', value: '10' },
                        { label: 'Partners', value: '0' },
                        { label: 'Resources', value: '0' },
                        { label: 'Placements', value: '0' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="relative py-24 max-w-7xl mx-auto px-6">
                {/* Geometric Pattern Background */}
                <div className="absolute inset-0 -z-10 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(99, 102, 241, 0.1) 35px, rgba(99, 102, 241, 0.1) 70px),
                                         repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(139, 92, 246, 0.1) 35px, rgba(139, 92, 246, 0.1) 70px)`
                    }} />
                </div>
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Everyone</h2>
                    <p className="text-gray-500">Everything you need to succeed in your college journey.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Briefcase}
                        title="Jobs & Internships"
                        description="Find the latest opportunities tailored to your major and skills. Apply with a single click."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={BookOpen}
                        title="Curated Resources"
                        description="Access PDF notes, video lectures, and previous year papers uploaded by faculty."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Bell}
                        title="Instant Updates"
                        description="Never miss an announcement or event. Real-time notifications for important deadlines."
                        delay={0.3}
                    />
                </div>
            </section>

            {/* RBAC Section */}
            <section className="py-20 bg-warm-900 text-white rounded-xl mx-4 my-10 overflow-hidden relative">
                {/* Tech-Inspired Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Designed for Every Role</h2>
                        <div className="space-y-6">
                            {[
                                { icon: Users, title: 'Student', desc: 'Manage profile, apply for jobs, and download resources.' },
                                { icon: ShieldCheck, title: 'Admin', desc: 'Post new opportunities, track applications, and manage users.' },
                                { icon: BookOpen, title: 'Faculty', desc: 'Contribute study material and post important announcements.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <item.icon size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white/90">{item.title}</h4>
                                        <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square glass-card rounded-xl bg-white/5 border-white/10 p-8 flex flex-col justify-center">
                            <div className="space-y-4">
                                <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                                <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" />
                                <div className="h-20 w-full bg-white/5 rounded-2xl border border-white/10 my-6" />
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-10 bg-primary/20 rounded-xl" />
                                    <div className="h-10 bg-white/10 rounded-xl" />
                                    <div className="h-10 bg-white/10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;

