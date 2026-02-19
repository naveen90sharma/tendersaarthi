import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen">
            {/* Minimal Header for Legal Pages */}
            <div className="bg-[#0B2C4A] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-widest mb-4">
                        <Shield size={12} />
                        Legal Transparency
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                        Privacy <span className="text-tj-yellow">Policy</span>
                    </h1>
                    <p className="text-blue-100/60 font-bold uppercase text-xs tracking-widest">Last Updated: February 18, 2026</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">
                        <p className="lead text-xl text-slate-700 font-bold mb-12">
                            Welcome to TenderSaarthi. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
                        </p>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center shrink-0">
                                    <Eye size={24} />
                                </div>
                                <h2 className="text-3xl m-0">1. Information We Collect</h2>
                            </div>
                            <p>
                                We collect several different types of information for various purposes to provide and improve our service to you. This includes:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                {[
                                    'Personal Identification Information (Name, email, phone)',
                                    'Business Details (Company name, GST, Address)',
                                    'Usage Data (IP address, browser type, pages visited)',
                                    'Cookies and Tracking Technologies'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 m-0">
                                        <ChevronRight size={16} className="text-primary" />
                                        <span className="text-sm font-bold text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Lock size={24} />
                                </div>
                                <h2 className="text-3xl m-0">2. How We Use Your Data</h2>
                            </div>
                            <p>
                                TenderSaarthi uses the collected data for various purposes:
                            </p>
                            <ul className="space-y-4">
                                <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
                                <li>To notify you about changes to our Service.</li>
                                <li>To provide customer support and gather analysis or valuable information so that we can improve our Service.</li>
                                <li>To detect, prevent and address technical issues.</li>
                            </ul>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-3xl m-0">3. Data Security</h2>
                            </div>
                            <p>
                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section className="mb-16 p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <h2 className="text-2xl mb-4">Questions or Feedback?</h2>
                            <p className="mb-6 m-0">
                                If you have any questions about this Privacy Policy, please contact our legal team at:
                            </p>
                            <div className="font-black text-primary">legal@tendersaarthi.com</div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
