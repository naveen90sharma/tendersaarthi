import { FileText, Scale, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#0B2C4A] py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFC212]/5 rounded-full blur-[100px] -ml-32 -mt-32 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-widest mb-4">
                        <Scale size={12} />
                        Usage Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                        Terms of <span className="text-tj-yellow">Service</span>
                    </h1>
                    <p className="text-blue-100/60 font-bold uppercase text-xs tracking-widest">Effective Date: January 1, 2026</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">
                        <p className="lead text-xl text-slate-700 font-bold mb-12">
                            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the TenderSaarthi website.
                        </p>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-tj-blue rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h2 className="text-3xl m-0">1. Acceptance of Terms</h2>
                            </div>
                            <p>
                                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-3xl m-0">2. User Accounts</h2>
                            </div>
                            <p>
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <h2 className="text-3xl m-0">3. Limitation of Liability</h2>
                            </div>
                            <p>
                                In no event shall TenderSaarthi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section className="mb-16 p-8 bg-tj-yellow/5 rounded-[2rem] border border-tj-yellow/10">
                            <h2 className="text-2xl mb-4">Agreement to Terms</h2>
                            <p className="mb-6 m-0">
                                By using our platform, you acknowledge that you have read and understood these terms. Any unauthorized use of the data provided may result in legal action according to IT Act of India.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
