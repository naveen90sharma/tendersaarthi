'use client';

interface NewsCardProps {
    id?: string | number;
    title: string;
    category: string;
    date: string;
    image: string;
    description?: string;
}

export default function NewsCard({ title, category, date, image, description }: NewsCardProps) {
    // Determine badge color based on category
    const getBadgeStyle = (cat: string) => {
        const lowerCat = cat.toLowerCase();
        if (lowerCat.includes('news')) return 'bg-[#2b507f] text-white'; // Deep Blue from GIF
        if (lowerCat.includes('article')) return 'bg-[#f48a3d] text-white'; // Muted Orange from GIF
        if (lowerCat.includes('press')) return 'bg-[#b8312f] text-white'; // Professional Red from GIF
        return 'bg-primary text-white';
    };

    return (
        <div className="group relative w-full h-[450px] bg-white rounded-lg overflow-hidden border border-slate-100 shadow-md transition-all duration-500 hover:shadow-2xl translate-y-0 hover:-translate-y-1">

            {/* Background Image Layer (Always at top) */}
            <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1454165833762-02617a92b219?q=80&w=2070&auto=format&fit=crop';
                    }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
            </div>

            {/* Sliding Content Layer */}
            {/* In default state (h-[150px]), it shows Title and Date at bottom. 
                On hover (h-[320px]), it slides UP adding more height to reveal desc. */}
            <div className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-in-out h-[150px] group-hover:h-[320px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] cursor-pointer">

                {/* Overlapping Badge (Stays atop the sliding layer) */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <span
                        className={`
                            whitespace-nowrap px-6 py-2.5 rounded-md text-[11px] font-black uppercase tracking-[0.2em] shadow-xl
                            ${getBadgeStyle(category)}
                            transition-all duration-300 group-hover:scale-105
                        `}
                    >
                        {category}
                    </span>
                </div>

                {/* Content Container */}
                <div className="h-full flex flex-col p-6 pt-10">

                    {/* 1. Title (Top of the content section) */}
                    {/* Always visible. Fixed at the top of the white area. */}
                    <div className="flex-shrink-0">
                        <h3 className="text-[17px] font-black text-[#1a1a1a] leading-[1.3] group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {title}
                        </h3>
                    </div>

                    {/* 2. Description (Middle Section - revealed on hover) */}
                    <div className="flex-grow mt-4 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        {description && (
                            <p className="text-[12px] text-slate-500 line-clamp-6 leading-[1.6] font-medium italic">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* 3. Date (Always fixed at the bottom of the content section) */}
                    <div className="flex-shrink-0 mt-auto pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                {date}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
