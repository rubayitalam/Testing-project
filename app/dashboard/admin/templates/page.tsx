'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { redirect } from 'next/navigation';

export default function AdminTemplatesPage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Portfolio',
        thumbnailUrl: '',
        isPremium: false,
        config: { primaryColor: '#000000' }
    });

    if (user) {
        const role = typeof user.role === 'string' ? user.role : user.role.name;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
            redirect('/dashboard');
        }
    }

    const { data: templatesResponse, isLoading } = useQuery({
        queryKey: ['admin-templates'],
        queryFn: async () => {
            const res = await templateApi.getAll();
            return res.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => templateApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
            setIsModalOpen(false);
            setFormData({ name: '', description: '', category: 'Portfolio', thumbnailUrl: '', isPremium: false, config: { primaryColor: '#000000' } });
            alert('Template created successfully!');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => templateApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-templates'] }),
    });

    if (isLoading) return <div className="p-12 text-center">Loading templates...</div>;

    const templates = templatesResponse || [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Template Management</h1>
                    <p className="text-gray-600 mt-2">Create and manage your global website templates</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    + Add Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                    <div key={template.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                        <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                            {template.thumbnailUrl ? (
                                <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {template.isPremium && (
                                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Premium</span>
                                )}
                                <span className="bg-white/90 text-gray-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">{template.category}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                            <div className="mt-6 pt-6 border-t flex items-center justify-between">
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    {template.usageCount || 0} active sites
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-blue-600 transition">⚙️</button>
                                    <button
                                        onClick={() => { if (confirm('Delete template?')) deleteMutation.mutate(template.id) }}
                                        className="text-gray-400 hover:text-red-600 transition"
                                    >🗑️</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create New Template</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Minimalist Pro"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none bg-white"
                                    >
                                        <option>Portfolio</option>
                                        <option>Wedding</option>
                                        <option>Commercial</option>
                                        <option>Landscape</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                                    <div className="flex-1 flex items-center">
                                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition border w-full">
                                            <input
                                                type="checkbox"
                                                checked={formData.isPremium}
                                                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-semibold text-gray-700">Premium Template</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Thumbnail URL</label>
                                <input
                                    type="text"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => createMutation.mutate(formData)}
                                disabled={createMutation.isPending}
                                className="flex-2 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
