'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteApi, templateApi } from '@/lib/api-services';
import Link from 'next/link';

export default function WebsitesPage() {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [formData, setFormData] = useState({ name: '', slug: '' });

    const { data: websites, isLoading } = useQuery({
        queryKey: ['websites'],
        queryFn: async () => {
            const res = await websiteApi.getAll();
            return res.data.data;
        },
    });

    const { data: templates } = useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const res = await templateApi.getAll();
            return res.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => websiteApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['websites'] });
            setShowCreateModal(false);
            setFormData({ name: '', slug: '' });
        },
    });

    const publishMutation = useMutation({
        mutationFn: (id: string) => websiteApi.publish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['websites'] });
        },
    });

    const handleCreate = () => {
        if (!selectedTemplate || !formData.name || !formData.slug) return;
        createMutation.mutate({
            ...formData,
            templateId: selectedTemplate,
        });
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Websites</h1>
                    <p className="text-gray-600 mt-2">Manage your photography websites</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    + Create Website
                </button>
            </div>

            {websites && websites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🌐</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites yet</h3>
                    <p className="text-gray-600 mb-6">Create your first website to get started</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Create Website
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites?.map((website: any) => (
                        <div key={website.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-6xl">🌐</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{website.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">{website.slug}.pixiset.app</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${website.isPublished
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {website.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    {website.buildStatus && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {website.buildStatus}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/websites/${website.id}`}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-200 transition"
                                    >
                                        Edit
                                    </Link>
                                    {!website.isPublished && (
                                        <button
                                            onClick={() => publishMutation.mutate(website.id)}
                                            disabled={publishMutation.isPending}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {publishMutation.isPending ? 'Publishing...' : 'Publish'}
                                        </button>
                                    )}
                                    {website.isPublished && website.publishedUrl && (
                                        <a
                                            href={website.publishedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-center font-medium hover:bg-green-700 transition"
                                        >
                                            View Live
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Website</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="My Photography Portfolio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Slug
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="my-portfolio"
                                    />
                                    <span className="text-gray-600">.pixiset.app</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Choose Template
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {templates?.map((template: any) => (
                                        <div
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template.id)}
                                            className={`cursor-pointer border-2 rounded-lg p-4 transition ${selectedTemplate === template.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={template.thumbnailUrl}
                                                alt={template.name}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                                            <p className="text-sm text-gray-600">{template.category}</p>
                                            {template.isPremium && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!selectedTemplate || !formData.name || !formData.slug || createMutation.isPending}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Website'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
