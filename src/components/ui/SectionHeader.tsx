import { ReactNode } from 'react';

type SectionHeaderColor =
    | 'brand-red'
    | 'brand-green'
    | 'blue'
    | 'purple'
    | 'amber'
    | 'teal'
    | 'neutral';

interface SectionHeaderProps {
    children: ReactNode;
    color?: SectionHeaderColor;
    className?: string;
}

const colorBorderMap: Record<SectionHeaderColor, string> = {
    'brand-red': 'border-brand-red',
    'brand-green': 'border-brand-green',
    'blue': 'border-blue-600',
    'purple': 'border-purple-600',
    'amber': 'border-amber-500',
    'teal': 'border-teal-600',
    'neutral': 'border-neutral-800',
};

export default function SectionHeader({
    children,
    color = 'brand-red',
    className = '',
}: SectionHeaderProps) {
    return (
        <h2
            className={`
        text-2xl font-heading font-bold text-neutral-900 
        mb-6 pb-3 border-b-2 inline-block pr-8
        ${colorBorderMap[color]}
        ${className}
      `}
        >
            {children}
        </h2>
    );
}
