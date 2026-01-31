'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function PublicWebsitePage() {
    const { slug } = useParams();

    const { data: website, isLoading, error } = useQuery({
        queryKey: ['public-site', slug],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/websites/slug/${slug}`);
            return res.data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-mono text-sm animate-pulse">
            LOADING WEBSITE...
        </div>
    );

    if (error || !website) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
            <span className="text-6xl mb-6">🏜️</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
            <p className="text-gray-500 max-w-md">The website you are looking for might have been moved or the slug is incorrect.</p>
            <a href="/" className="mt-8 text-blue-600 font-bold hover:underline">Go to Pixiset</a>
        </div>
    );

    const settings = website.settings || {};
    const primaryColor = settings.primaryColor || '#3B82F6';
    const fontFamily = settings.fontFamily || 'Inter';

    return (
        <div className="min-h-screen bg-white transition-colors duration-700" style={{ fontFamily }}>
            {/* Dynamic Header */}
            <header className="px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100">
                {website.logoUrl ? (
                    <img src={website.logoUrl} alt={website.name} className="h-10 object-contain" />
                ) : (
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: primaryColor }}>{website.name.toUpperCase()}</h1>
                )}

                <nav className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <a href="#" className="text-gray-900 transition hover:opacity-70">Home</a>
                    <a href="#" className="transition hover:opacity-70">Portfolio</a>
                    <a href="#" className="transition hover:opacity-70">About</a>
                    <a href="#" className="transition hover:opacity-70">Contact</a>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-8 py-24 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-10 border border-gray-100">
                    Professional Photography
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-gray-900 mb-10 leading-[0.9] tracking-tighter">
                    SAVING YOUR <br />
                    <span style={{ color: primaryColor }}>BEST MOMENTS.</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
                    Capturing the essence of life through the lens. Based in the UK, available worldwide for weddings, commercial projects and fine art photography.
                </p>
                <button
                    className="px-12 py-5 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-2xl transition hover:scale-105 active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                >
                    Book a Session
                </button>
            </main>

            {/* Dynamic Gallery Grid (Mockup of what would come from linked galleries) */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="flex justify-between items-end mb-16">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Featured Work</h3>
                        <a href="#" className="text-xs font-bold underline transition hover:text-gray-400">View All</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 group cursor-pointer transition hover:shadow-xl">
                                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-4xl grayscale group-hover:grayscale-0 transition duration-500 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                                    📸
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 max-w-4xl mx-auto px-8 text-center italic text-2xl text-gray-600 leading-relaxed font-serif">
                "The photos are absolutely breathtaking. We couldn't have asked for a better way to remember our special day. Thank you so much for your incredible vision and professionalism."
                <div className="mt-8 not-italic font-sans text-xs font-black uppercase tracking-widest text-gray-900">— Sarah & John, London</div>
            </section>

            <footer className="py-20 border-t border-gray-100 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} {website.name}. Built with Pixiset.</p>
            </footer>
        </div>
    );
}
