'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, clearAuth } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!mounted || !isAuthenticated()) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 font-medium">Loading session...</div>
        </div>;
    }

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: '📊' },
        { name: 'Websites', href: '/dashboard/websites', icon: '🌐' },
        { name: 'Templates', href: '/dashboard/templates', icon: '🎨' },
        { name: 'Galleries', href: '/dashboard/galleries', icon: '🖼️' },
        { name: 'Clients', href: '/dashboard/clients', icon: '👥' },
        { name: 'Bookings', href: '/dashboard/bookings', icon: '📅' },
        { name: 'Subscription', href: '/dashboard/subscription', icon: '💳' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ];

    const adminNavigation = [
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈' },
        { name: 'Users', href: '/dashboard/admin/users', icon: '👤' },
        { name: 'All Templates', href: '/dashboard/admin/templates', icon: '🎨' },
        { name: 'Payments', href: '/dashboard/admin/payments', icon: '💰' },
        { name: 'Audit Logs', href: '/dashboard/admin/audit', icon: '📝' },
    ];

    const role = typeof user?.role === 'string' ? user.role : user?.role?.name;
    const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-blue-600">Pixiset</h1>
                        <p className="text-sm text-gray-600 mt-1">{user?.businessName || `${user?.firstName} ${user?.lastName}`}</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === item.href
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}

                        {isAdmin && (
                            <>
                                <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase">
                                    Admin
                                </div>
                                {adminNavigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === item.href
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-3"
                        >
                            <span>🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
