import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Briefcase, BookOpen, ChevronDown, GraduationCap, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 my-3 rounded-xl">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        CampusResource Portal
                    </Link>



                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link to="/jobs" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2">
                                    <Briefcase size={18} /> Jobs
                                </Link>
                                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2">
                                    <BookOpen size={18} /> Resources
                                </Link>
                                {(user.role === 'faculty' || user.role === 'admin') && (
                                    <Link to="/students" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2">
                                        <GraduationCap size={18} /> Students
                                    </Link>
                                )}
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <Link
                                        to={user.role === 'student' ? '/profile/student' : '/profile/faculty'}
                                        className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                                    >
                                        {user.name}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-medium">Sign In</Link>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="btn-primary flex items-center gap-2 py-2 px-5"
                                    >
                                        Get Started <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-warm-200 py-2 overflow-hidden">
                                            <Link
                                                to="/student/register"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                    <GraduationCap size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">Student Portal</span>
                                                    <span className="text-[10px] text-gray-400">Join as a Learner</span>
                                                </div>
                                            </Link>
                                            <div className="h-px bg-gray-50 mx-2" />
                                            <Link
                                                to="/faculty/register"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-secondary/5 hover:text-secondary transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                                                    <UserPlus size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">Faculty Portal</span>
                                                    <span className="text-[10px] text-gray-400">Join as Contributor</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

