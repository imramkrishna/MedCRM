import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    title: string;
    variant?: 'view' | 'edit' | 'delete' | 'add' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    icon: Icon,
    title,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'view':
                return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300';
            case 'edit':
                return 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300';
            case 'delete':
                return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300';
            case 'add':
                return 'text-green-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
            case 'primary':
                return 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300';
            case 'secondary':
                return 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
            default:
                return 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-8 w-8';
            case 'md':
                return 'h-9 w-9';
            case 'lg':
                return 'h-10 w-10';
            default:
                return 'h-9 w-9';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 'h-3 w-3';
            case 'md':
                return 'h-4 w-4';
            case 'lg':
                return 'h-5 w-5';
            default:
                return 'h-4 w-4';
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${getVariantClasses()}
                ${getSizeClasses()}
                inline-flex items-center justify-center
                border rounded-lg transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                relative shrink-0
            `}
            title={title}
        >
            {loading ? (
                <div className={`animate-spin rounded-full border-b-2 border-current ${getIconSize()}`} />
            ) : (
                <Icon className={getIconSize()} />
            )}
        </button>
    );
};

export default ActionButton;