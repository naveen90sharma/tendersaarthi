'use client';

interface NewsImageProps {
    src: string;
    alt: string;
    className?: string;
}

const FALLBACK = 'https://images.unsplash.com/photo-1454165833762-02617a92b219?q=80&w=2070&auto=format&fit=crop';

export default function NewsImage({ src, alt, className }: NewsImageProps) {
    return (
        <img
            src={src || FALLBACK}
            alt={alt}
            className={className}
            onError={(e) => {
                e.currentTarget.src = FALLBACK;
            }}
        />
    );
}
