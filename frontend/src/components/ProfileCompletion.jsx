import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ProfileCompletion = ({ percentage, showLabel = true, size = 'md' }) => {
    // Determine color based on completion percentage
    const getColor = () => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getBgColor = () => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg'
    };

    return (
        <div className="flex items-center gap-3">
            {/* Circular Progress */}
            <div className="relative">
                <svg className={`${sizeClasses[size]} transform -rotate-90`}>
                    {/* Background circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - percentage / 100)}
                        strokeLinecap="round"
                        className={`${getColor()} transition-all duration-500`}
                    />
                </svg>
                {/* Percentage text in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold ${textSizeClasses[size]} ${getColor()}`}>
                        {percentage}%
                    </span>
                </div>
            </div>

            {/* Label */}
            {showLabel && (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700">
                        Profile Completion
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                        {percentage >= 80 ? (
                            <>
                                <CheckCircle size={14} className="text-green-500" />
                                <span className="text-xs text-green-600">Complete</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={14} className="text-yellow-500" />
                                <span className="text-xs text-gray-500">
                                    {percentage >= 50 ? 'Almost there!' : 'Needs attention'}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCompletion;

