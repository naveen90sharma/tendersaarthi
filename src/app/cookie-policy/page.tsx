import { Cookie, ShieldCheck, Settings, Eye, Info } from 'lucide-react';

export default function CookiePolicy() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#0B2C4A] py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-widest mb-4">
                        <Cookie size={12} />
                        Browser Experience
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none">
                        Cookie <span className="text-tj-yellow">Policy</span>
                    </h1>
                    <p className="text-blue-100/60 font-bold uppercase text-xs tracking-widest">Optimizing Your Intelligence Flow</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">

                        <p className="lead text-xl text-slate-700 font-bold mb-12">
                            This Cookie Policy explains how TenderSaarthi uses cookies and similar technologies to recognize you when you visit our website.
                        </p>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-tj-blue rounded-xl flex items-center justify-center shrink-0">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-3xl m-0">1. What are Cookies?</h2>
                            </div>
                            <p>
                                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                            </p>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 className="text-3xl m-0">2. Why We Use Cookies</h2>
                            </div>
                            <p>
                                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                {[
                                    { title: 'Essential', desc: 'Secure login & fraud prevention.' },
                                    { title: 'Performance', desc: 'Speed optimization & error tracking.' },
                                    { title: 'Analytics', desc: 'Understanding user search patterns.' },
                                    { title: 'Functional', desc: 'Remembering your state/category filters.' }
                                ].map((type, i) => (
                                    <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h4 className="text-sm font-black m-0 mb-1 uppercase text-slate-800">{type.title}</h4>
                                        <p className="text-xs m-0 text-slate-500 font-bold">{type.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                                    <Settings size={24} />
                                </div>
                                <h2 className="text-3xl m-0">3. Controlling Cookies</h2>
                            </div>
                            <p>
                                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to refuse cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                        </section>

                        <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 text-center">
                            <h3 className="text-emerald-800 font-black m-0 mb-4 uppercase tracking-tight">Need More Clarity?</h3>
                            <p className="m-0 text-emerald-700/80 font-bold mb-6">
                                If you have any questions about our use of cookies or other technologies, please email us.
                            </p>
                            <div className="font-black text-emerald-600">privacy@tendersaarthi.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
