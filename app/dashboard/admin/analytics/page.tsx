'use client';

import { useQuery } from '@tanstack/react-query';
import { websiteApi, galleryApi, userApi, subscriptionApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { redirect } from 'next/navigation';

export default function AdminAnalyticsPage() {
    const { user } = useAuthStore();

    if (user) {
        const role = typeof user.role === 'string' ? user.role : user.role.name;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
            redirect('/dashboard');
        }
    }

    const { data: users } = useQuery({
        queryKey: ['admin-stats-users'],
        queryFn: () => userApi.getAll(1, ''),
    });

    const { data: websites } = useQuery({
        queryKey: ['admin-stats-websites'],
        queryFn: () => websiteApi.getAll(),
    });

    const { data: plans } = useQuery({
        queryKey: ['admin-stats-plans'],
        queryFn: () => subscriptionApi.getPlans(),
    });

    const stats = [
        { label: 'Total Users', value: users?.data?.meta?.total || 0, change: '+12%', icon: '👥' },
        { label: 'Live Websites', value: websites?.data?.data?.length || 0, change: '+5%', icon: '🌐' },
        { label: 'Platform Revenue', value: '£4,250', change: '+23%', icon: '💰' },
        { label: 'Total Photos', value: '12,480', change: '+45%', icon: '📸' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
                <p className="text-gray-600 mt-2">Overview of Pixiset growth and usage metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart Mockup */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Growth (GBP)</h3>
                        <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-0">
                            <option>Last 6 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {[45, 60, 55, 85, 70, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-blue-100 rounded-lg relative group transition-all" style={{ height: `${height}%` }}>
                                    <div className="absolute inset-x-0 bottom-0 bg-blue-600 rounded-lg transition-all group-hover:bg-blue-700" style={{ height: '40%' }}></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                        £{(height * 50).toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Month {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Breakdown */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-8">Plan Distribution</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Free Plan', count: 850, color: 'bg-gray-400', percent: 65 },
                            { label: 'Pro Plan (£29)', count: 320, color: 'bg-blue-600', percent: 25 },
                            { label: 'Studio Plan (£79)', count: 130, color: 'bg-indigo-600', percent: 10 },
                        ].map((plan) => (
                            <div key={plan.label}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold text-gray-700">{plan.label}</span>
                                    <span className="text-gray-500 font-bold">{plan.count} Users</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`${plan.color} h-full transition-all duration-1000`} style={{ width: `${plan.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t flex items-center justify-between text-sm">
                        <div className="text-gray-500">Active Subscriptions: <span className="font-bold text-gray-900">450</span></div>
                        <div className="text-gray-500">Churn Rate: <span className="font-bold text-red-600">2.4%</span></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">System Audit Log</h3>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All Logs</button>
                </div>
                <div className="divide-y">
                    {[
                        { action: 'Website Published', user: 'James Wilson', target: 'wilson-studios.pixiset.app', time: '2 mins ago', icon: '🚀' },
                        { action: 'New Subscription', user: 'Sarah Miller', target: 'Studio Plan (£79)', time: '15 mins ago', icon: '💳' },
                        { action: 'Photos Uploaded', user: 'Robert Chen', target: '24 photos to "Wedding 2024"', time: '45 mins ago', icon: '📸' },
                        { action: 'New Booking', user: 'Emily Davis', target: 'Portrait Session', time: '1 hour ago', icon: '📅' },
                        { action: 'Template Created', user: 'Admin', target: 'Added "Fashion Pro" template', time: '3 hours ago', icon: '🛠️' },
                    ].map((log, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="text-xl w-10 h-10 bg-gray-100 flex items-center justify-center rounded-xl">{log.icon}</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">{log.action}</div>
                                    <div className="text-xs text-gray-500"><span className="font-semibold">{log.user}</span> • {log.target}</div>
                                </div>
                            </div>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">{log.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
