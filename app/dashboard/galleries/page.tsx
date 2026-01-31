'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from '@/lib/api-services';
import Link from 'next/link';

export default function GalleriesPage() {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        privacy: 'private',
    });

    const { data: galleries, isLoading } = useQuery({
        queryKey: ['galleries'],
        queryFn: async () => {
            const res = await galleryApi.getAll();
            return res.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => galleryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['galleries'] });
            setShowCreateModal(false);
            setFormData({ name: '', slug: '', description: '', privacy: 'private' });
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
                    <h1 className="text-3xl font-bold text-gray-900">Galleries</h1>
                    <p className="text-gray-600 mt-2">Organize and share your photos</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    + Create Gallery
                </button>
            </div>

            {galleries && galleries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No galleries yet</h3>
                    <p className="text-gray-600 mb-6">Create your first gallery to start uploading photos</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Create Gallery
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleries?.map((gallery: any) => (
                        <Link
                            key={gallery.id}
                            href={`/dashboard/galleries/${gallery.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group"
                        >
                            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
                                {gallery.photos?.[0] ? (
                                    <img
                                        src={gallery.photos[0].thumbnailUrl}
                                        alt={gallery.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <span className="text-6xl">🖼️</span>
                                )}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full">
                                    {gallery._count?.photos || 0} photos
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{gallery.name}</h3>
                                {gallery.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gallery.description}</p>
                                )}

                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${gallery.privacy === 'public'
                                            ? 'bg-green-100 text-green-700'
                                            : gallery.privacy === 'private'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {gallery.privacy}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {gallery.viewCount || 0} views
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Gallery</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gallery Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Wedding 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="wedding-2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Beautiful wedding photos..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Privacy
                                </label>
                                <select
                                    value={formData.privacy}
                                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                    <option value="password">Password Protected</option>
                                </select>
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
                                disabled={!formData.name || !formData.slug || createMutation.isPending}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
