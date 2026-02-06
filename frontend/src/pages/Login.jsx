import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, GraduationCap, BookOpen, ShieldAlert, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
    const [activeTab, setActiveTab] = useState('student'); // 'student', 'faculty', 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setFormData({ email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(formData.email, formData.password);

            // Validate role
            if (data.role !== activeTab) {
                setError(`This portal is for ${activeTab}s. Your account is registered as ${data.role}.`);
                return;
            }

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            if (!err.response) {
                setError('Server is not responding. Please ensure the backend is running.');
            } else {
                setError(err.response.data?.message || 'Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'student', label: 'Student', icon: GraduationCap, color: 'primary' },
        { id: 'faculty', label: 'Faculty', icon: BookOpen, color: 'secondary' },
        { id: 'admin', label: 'Admin', icon: ShieldAlert, color: 'red-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 pt-32 pb-20 flex items-center justify-center px-6">
                <div className="w-full max-w-lg">
                    <div className="glass-card p-1 rounded-lg relative overflow-hidden">
                        {/* Tab Switcher */}
                        <div className="flex p-2 bg-gray-100/50 rounded-lg mb-8 relative">
                            {/* Sliding Highlighter */}
                            <div
                                className={`absolute top-2 bottom-2 w-[32%] rounded-[1.8rem] transition-all duration-500 ease-out shadow-lg
                                    ${activeTab === 'student' ? 'left-2 bg-primary' :
                                        activeTab === 'faculty' ? 'left-[34%] bg-secondary' :
                                            'left-[66%] bg-gray-900'}`}
                            />

                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-300
                                        ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="px-8 pb-8">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login
                                </h2>
                                <p className="text-gray-500">
                                    {activeTab === 'student' && "Access your resources and job applications"}
                                    {activeTab === 'faculty' && "Contribute resources and manage announcements"}
                                    {activeTab === 'admin' && "Secure access for campus management"}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 italic transition-all animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                                        {activeTab === 'admin' ? 'Admin ID / Email' : activeTab === 'faculty' ? 'Faculty ID / Email' : 'University Email'}
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 pl-1">
                                        <input
                                            type="checkbox"
                                            id="show-password"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer hover:scale-110 transition-transform"
                                        />
                                        <label htmlFor="show-password" size={18} className="text-xs text-gray-500 cursor-pointer select-none">Show Password</label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-bold transition-all active:scale-95 shadow-xl border-none text-white
                                        ${activeTab === 'student' ? 'bg-primary shadow-indigo-100 hover:bg-primary/90' :
                                            activeTab === 'faculty' ? 'bg-secondary shadow-pink-100 hover:bg-secondary/90' :
                                                'bg-gray-900 shadow-gray-200 hover:bg-gray-800'}`}
                                >
                                    {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In</>}
                                </button>
                            </form>

                            {activeTab !== 'admin' && (
                                <div className="mt-8 text-center text-gray-500 text-sm">
                                    New {activeTab}?{' '}
                                    <Link
                                        to={activeTab === 'student' ? '/student/register' : '/faculty/register'}
                                        className={`font-semibold hover:underline underline-offset-4 ${activeTab === 'student' ? 'text-primary' : 'text-secondary'}`}
                                    >
                                        Register here
                                    </Link>
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <Link to="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                                    Back to Home <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

