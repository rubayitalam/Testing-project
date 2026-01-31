'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/lib/api-services';

export default function ClientsPage() {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        notes: '',
    });

    const { data: clients, isLoading } = useQuery({
        queryKey: ['clients', searchQuery],
        queryFn: async () => {
            const res = await clientApi.getAll({ search: searchQuery });
            return res.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => clientApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            setShowCreateModal(false);
            setFormData({ email: '', firstName: '', lastName: '', phoneNumber: '', address: '', notes: '' });
        },
    });

    const handleCreate = () => {
        createMutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-2">Manage your client database</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    + Add Client
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clients..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {clients && clients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No clients yet</h3>
                    <p className="text-gray-600 mb-6">Add your first client to get started</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Add Client
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bookings</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Galleries</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clients?.map((client: any) => (
                                <tr key={client.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {client.firstName} {client.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{client.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{client.phoneNumber || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {client._count?.bookings || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {client._count?.galleryClients || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address (Optional)
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!formData.email || !formData.firstName || !formData.lastName || createMutation.isPending}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Adding...' : 'Add Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
