'use client';

export default function NewsSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[450px]">
            {/* Image Skeleton */}
            <div className="h-52 bg-slate-200 w-full" />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4 flex-1">
                {/* Date/Meta */}
                <div className="h-3 bg-slate-100 rounded-full w-24" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded-full w-full" />
                    <div className="h-5 bg-slate-200 rounded-full w-4/5" />
                </div>

                {/* Content info */}
                <div className="space-y-2 mt-4">
                    <div className="h-3 bg-slate-100 rounded-full w-full" />
                    <div className="h-3 bg-slate-100 rounded-full w-full" />
                </div>

                {/* Bottom link skeleton */}
                <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="h-3 bg-slate-100 rounded-full w-20" />
                    <div className="w-7 h-7 bg-slate-100 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function FeaturedNewsSkeleton() {
    return (
        <div className="animate-pulse mb-12 grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-[400px]">
            <div className="bg-slate-200 h-full w-full" />
            <div className="p-10 flex flex-col justify-center space-y-6">
                <div className="h-3 bg-slate-100 rounded-full w-32" />
                <div className="space-y-3">
                    <div className="h-8 bg-slate-200 rounded-full w-full" />
                    <div className="h-8 bg-slate-200 rounded-full w-2/3" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                </div>
                <div className="h-4 bg-slate-200 rounded-full w-40" />
            </div>
        </div>
    );
}
