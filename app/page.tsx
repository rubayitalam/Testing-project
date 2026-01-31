import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Create Stunning Photography Websites
                        <span className="text-blue-600"> in Minutes</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Professional templates, one-click publishing, and powerful tools for photographers.
                        Start for free, upgrade as you grow.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">One-Click Publishing</h3>
                        <p className="text-gray-600">
                            Choose a template, customize it, and publish your website instantly. No coding required.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Gallery Management</h3>
                        <p className="text-gray-600">
                            Upload, organize, and share your photos with clients. Password-protected galleries included.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Client Booking</h3>
                        <p className="text-gray-600">
                            Accept bookings, manage your calendar, and collect payments all in one place.
                        </p>
                    </div>
                </div>

                {/* Pricing Preview */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600 mb-8">Start free, upgrade when you're ready</p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <p className="text-4xl font-bold mb-4">£0<span className="text-lg text-gray-500">/mo</span></p>
                            <ul className="text-left space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    1 Website
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    5 Galleries
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    1GB Storage
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg transform scale-105">
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <p className="text-4xl font-bold mb-4">£29<span className="text-lg opacity-75">/mo</span></p>
                            <ul className="text-left space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Unlimited Websites
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Unlimited Galleries
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    50GB Storage
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Custom Domain
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h3 className="text-2xl font-bold mb-2">Studio</h3>
                            <p className="text-4xl font-bold mb-4">£79<span className="text-lg text-gray-500">/mo</span></p>
                            <ul className="text-left space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Everything in Pro
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Unlimited Storage
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Premium Templates
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Priority Support
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">© 2024 Pixiset. Built for photographers, by photographers.</p>
                </div>
            </footer>
        </div>
    );
}
