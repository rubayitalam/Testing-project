'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { redirect } from 'next/navigation';

export default function AdminPaymentsPage() {
    const { user } = useAuthStore();

    if (user) {
        const role = typeof user.role === 'string' ? user.role : user.role.name;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
            redirect('/dashboard');
        }
    }

    const { data: paymentsResponse, isLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await paymentApi.getAll();
            return res.data.data;
        },
    });

    if (isLoading) return <div className="p-12 text-center">Loading transactions...</div>;

    const payments = paymentsResponse || [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                    <p className="text-gray-600 mt-2">Monitor all platform transactions and subscriptions</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-gray-300 transition">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No transactions found</td>
                            </tr>
                        ) : (
                            payments.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {p.stripePaymentIntentId || p.id.slice(0, 12)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">{p.user?.email || 'System'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">£{(p.amount / 100).toFixed(2)}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{p.currency}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(p.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-700 text-xs font-bold">Details</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
