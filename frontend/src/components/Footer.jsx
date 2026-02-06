import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-warm-50 border-t border-warm-200 py-12 mt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        CampusResource Portal
                    </h3>
                    <p className="text-warm-600 max-w-sm mb-6">
                        Your one-stop campus hub for opportunities, resources, and connections. Built by students, for students.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li><a href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</a></li>
                        <li><a href="/resources" className="hover:text-primary transition-colors">Study Material</a></li>
                        <li><a href="/register" className="hover:text-primary transition-colors">Student Career</a></li>
                        <li><a href="/admin" className="hover:text-primary transition-colors">Admin Access</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li className="flex items-center gap-2 italic">
                            <Mail size={16} /> support@campusresourceportal.edu
                        </li>
                        <li>Placement Cell, Tower B</li>
                        <li>University Campus</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-50 text-center text-gray-400 text-sm">
                © 2026 CampusResource Portal. Made with care for students everywhere.
            </div>
        </footer>
    );
};

export default Footer;

