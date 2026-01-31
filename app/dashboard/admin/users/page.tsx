'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { redirect } from 'next/navigation';

export default function AdminUsersPage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    // Security check - client side redirect if not admin
    if (user) {
        const role = typeof user.role === 'string' ? user.role : user.role.name;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
            redirect('/dashboard');
        }
    }

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ['admin-users', searchQuery, page],
        queryFn: async () => {
            const res = await userApi.getAll(page, searchQuery);
            return res.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) => userApi.updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            alert('User role updated!');
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isSuspended }: { id: string, isSuspended: boolean }) =>
            isSuspended ? userApi.activate(id) : userApi.suspend(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            alert('User status updated!');
        },
    });

    if (isLoading) return <div className="p-12 text-center">Loading users...</div>;

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta || { total: 0, page: 1, limit: 10 };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage all registered users and their permissions</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
                        Total Users: {meta.total}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((u: any) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {u.firstName?.[0] || u.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value })}
                                        className="text-xs font-semibold bg-gray-100 border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="PHOTOGRAPHER">Photographer</option>
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {u.isSuspended ? 'Suspended' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString('en-GB')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => toggleStatusMutation.mutate({ id: u.id, isSuspended: u.isSuspended })}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${u.isSuspended ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            {u.isSuspended ? 'Activate' : 'Suspend'}
                                        </button>
                                        <button className="text-gray-400 hover:text-blue-600 p-1.5 transition">
                                            ⚙️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing page {page} of {Math.ceil(meta.total / meta.limit)}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page * meta.limit >= meta.total}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
