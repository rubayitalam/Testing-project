'use client';

import { useQuery } from '@tanstack/react-query';
import { websiteApi, galleryApi, clientApi, bookingApi, subscriptionApi } from '@/lib/api-services';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: websites } = useQuery({
        queryKey: ['websites'],
        queryFn: async () => {
            const res = await websiteApi.getAll();
            return res.data.data;
        },
    });

    const { data: galleries } = useQuery({
        queryKey: ['galleries'],
        queryFn: async () => {
            const res = await galleryApi.getAll();
            return res.data.data;
        },
    });

    const { data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const res = await clientApi.getAll();
            return res.data.data;
        },
    });

    const { data: bookings } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await bookingApi.getAll();
            return res.data.data;
        },
    });

    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const res = await subscriptionApi.getCurrent();
            return res.data.data;
        },
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Websites</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{websites?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌐</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Galleries</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{galleries?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🖼️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Clients</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{clients?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Bookings</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{bookings?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📅</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Status */}
            {subscription && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Current Plan</p>
                            <p className="text-2xl font-bold mt-1">{subscription.planDetails?.name || subscription.plan}</p>
                            <p className="text-sm opacity-75 mt-2">
                                {subscription.status === 'active' ? 'Active' : subscription.status}
                                {subscription.cancelAtPeriodEnd && ' (Cancels at period end)'}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/subscription"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Manage Plan
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/websites"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <span className="text-2xl">🌐</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Website</h3>
                    <p className="text-gray-600 text-sm">Choose a template and launch your site</p>
                </Link>

                <Link
                    href="/dashboard/galleries"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <span className="text-2xl">🖼️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">New Gallery</h3>
                    <p className="text-gray-600 text-sm">Upload and organize your photos</p>
                </Link>

                <Link
                    href="/dashboard/clients"
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Client</h3>
                    <p className="text-gray-600 text-sm">Manage your client database</p>
                </Link>
            </div>
        </div>
    );
}
