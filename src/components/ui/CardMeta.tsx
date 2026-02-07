import { formatRelativeTime } from '../../lib/utils';

interface CardMetaProps {
    authorName?: string;
    date: string;
    className?: string;
    showAuthor?: boolean;
}

export default function CardMeta({
    authorName,
    date,
    className = '',
    showAuthor = true
}: CardMetaProps) {
    return (
        <div className={`flex items-center gap-2 text-[10px] sm:text-xs text-neutral-500 font-medium ${className}`}>
            {showAuthor && authorName && (
                <>
                    <span className="text-neutral-700 font-bold uppercase tracking-wide">
                        {authorName}
                    </span>
                    <span className="text-brand-red">•</span>
                </>
            )}
            <time dateTime={date} className="tracking-wide">
                {formatRelativeTime(date)}
            </time>
        </div>
    );
}
