import { RotateCcw, Ban, CreditCard, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function RefundPolicy() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#0B2C4A] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tj-yellow/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-widest mb-4">
                        <RotateCcw size={12} />
                        Transaction Protection
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                        Refund & <span className="text-tj-yellow">Cancellation</span>
                    </h1>
                    <p className="text-blue-100/60 font-bold uppercase text-xs tracking-widest">Our Commitment to Fairness</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {[
                                { title: '7 Day Window', desc: 'Eligibility for refund requests.', icon: <CreditCard className="text-blue-500" /> },
                                { title: 'No Hidden Fees', desc: 'Transparent processing.', icon: <RefreshCw className="text-emerald-500" /> },
                                { title: 'Fast Transfer', desc: '72 hour processing time.', icon: <CheckCircle2 className="text-tj-yellow" /> }
                            ].map((card, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        {card.icon}
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-tight mb-1 text-slate-800">{card.title}</h4>
                                    <p className="text-xs m-0 text-slate-400 font-bold uppercase">{card.desc}</p>
                                </div>
                            ))}
                        </div>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-tj-blue rounded-xl flex items-center justify-center shrink-0">
                                    <Ban size={24} />
                                </div>
                                <h2 className="text-3xl m-0">1. Cancellation Policy</h2>
                            </div>
                            <p>
                                Subscriptions at TenderSaarthi can be cancelled at any time through your User Dashboard. Upon cancellation, your account will remain active until the end of the current billing cycle. No further charges will be applied once the cancellation is processed.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <RotateCcw size={24} />
                                </div>
                                <h2 className="text-3xl m-0">2. Refund Eligibility</h2>
                            </div>
                            <p>
                                Refunds are only applicable if a request is raised within 7 days of the initial purchase. To be eligible for a refund, the user must not have downloaded more than 3 premium tender documents during the active subscription period.
                            </p>
                            <ul className="space-y-4">
                                <li><strong>Exceptions:</strong> One-time tender submission fees are non-refundable once the submission process is initiated by our team.</li>
                                <li><strong>Technical Issues:</strong> If you face a technical error that prevents access to paid content, and we fail to resolve it within 48 hours, a pro-rata refund will be issued.</li>
                            </ul>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-3xl m-0">3. Process for Refund</h2>
                            </div>
                            <p>
                                To initiate a refund, please send an email to <span className="font-black text-primary">billing@tendersaarthi.com</span> with your transaction ID and reason for refund. Our team will review the request and notify you within 3 business days.
                            </p>
                        </section>

                        <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 text-center">
                            <p className="m-0 font-bold text-slate-700">
                                All refunds are credited back to the original payment source (Bank Account/Credit Card/UPI) used during the transaction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
