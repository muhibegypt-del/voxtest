import { ReactNode } from 'react';

export type BadgeVariant = 'red' | 'neutral' | 'green' | 'category';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    icon?: ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    red: 'bg-badge-red-bg text-badge-red-text',
    neutral: 'bg-badge-neutral-bg text-badge-neutral-text',
    green: 'bg-badge-green-bg text-badge-green-text',
    category: 'bg-neutral-900 text-brand-red border border-brand-red',
};

export default function Badge({
    children,
    variant = 'neutral',
    icon,
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-3 py-1 rounded-sm 
        text-xs font-semibold uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {icon && <span className="mr-1.5">{icon}</span>}
            {children}
        </span>
    );
}
