
const brands = [
    { name: 'PWD', color: 'bg-red-600', initials: 'PWD' },
    { name: 'Railways', color: 'bg-blue-600', initials: 'IR' },
    { name: 'CPWD', color: 'bg-green-700', initials: 'CP' },
    { name: 'NHAI', color: 'bg-orange-500', initials: 'NH' },
    { name: 'MES', color: 'bg-green-800', initials: 'MES' },
    { name: 'ONGC', color: 'bg-red-800', initials: 'ON' },
    { name: 'BHEL', color: 'bg-blue-400', initials: 'BH' },
    { name: 'NTPC', color: 'bg-blue-900', initials: 'NT' },
    { name: 'MCD', color: 'bg-yellow-600', initials: 'MCD' },
    { name: 'DDA', color: 'bg-black', initials: 'DDA' },
    { name: 'IOCL', color: 'bg-orange-600', initials: 'IO' },
    { name: 'GAIL', color: 'bg-blue-500', initials: 'GL' },
];

export default function BrandSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Tenders By Authority</h2>
                    <a href="#" className="hidden md:block px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition font-medium text-gray-600">View All Authorities</a>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {brands.map((brand) => (
                        <div key={brand.name} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer group bg-white">
                            <div className={`w-14 h-14 ${brand.color} rounded-full flex items-center justify-center text-white font-bold text-sm mb-3 shadow-sm`}>
                                {brand.initials}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-primary text-center">{brand.name}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 md:hidden text-center">
                    <a href="#" className="inline-block px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">View All Authorities</a>
                </div>

                {/* Banner Ad below brands */}
                <div className="mt-12 hidden md:block rounded-lg overflow-hidden h-24 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 flex items-center justify-center text-white">
                    <div className="text-center">
                        <h3 className="text-xl font-bold">Grow Your Business with Government Tenders</h3>
                        <p className="text-sm opacity-90">Unlock Opportunities with TenderSaarthi</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
