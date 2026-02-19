import { AlertCircle, ShieldAlert, Scale, Info, ChevronRight } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#0B2C4A] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldAlert size={12} />
                        Legal Disclaimer
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                        Legal <span className="text-tj-yellow">Disclaimer</span>
                    </h1>
                    <p className="text-blue-100/60 font-bold uppercase text-xs tracking-widest">Important Information for Users</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">

                        <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-[2rem] mb-12">
                            <div className="flex items-center gap-3 mb-4 text-red-700">
                                <AlertCircle size={24} />
                                <h3 className="m-0 text-red-700 font-black uppercase tracking-tight">Financial & Legal Warning</h3>
                            </div>
                            <p className="m-0 text-red-800/80 font-bold leading-relaxed">
                                The information provided by TenderSaarthi ("we," "us," or "our") on our website is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind.
                            </p>
                        </div>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-tj-blue rounded-xl flex items-center justify-center shrink-0">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-3xl m-0">1. External Links Disclaimer</h2>
                            </div>
                            <p>
                                Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with TenderSaarthi. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Scale size={24} />
                                </div>
                                <h2 className="text-3xl m-0">2. Professional Disclaimer</h2>
                            </div>
                            <p>
                                The Service cannot and does not contain legal or business advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <h2 className="text-3xl m-0">3. Errors and Omissions</h2>
                            </div>
                            <p>
                                While we have made every attempt to ensure that the information contained on this site has been obtained from reliable sources, TenderSaarthi is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                            </p>
                        </section>

                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 text-center">
                            <p className="m-0 font-bold text-slate-500 italic">
                                "The use or reliance of any information contained on this site is solely at your own risk."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
