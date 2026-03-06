'use client';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
        {/* Simplified loading animation to avoid styled-jsx issues in server-side contexts */}
        <div className="absolute inset-4 border-2 border-primary/40 border-b-transparent rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      </div>
      <p className="mt-8 text-gray-500 font-medium animate-pulse tracking-wide text-sm uppercase">
        Loading TenderSaarthi...
      </p>
    </div>
  );
}

