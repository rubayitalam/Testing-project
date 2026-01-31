'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteApi } from '@/lib/api-services';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WebsiteBuilderPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'general' | 'design' | 'pages'>('general');
    const [formData, setFormData] = useState<any>({});
    const [designData, setDesignData] = useState<any>({});

    const { data: website, isLoading } = useQuery({
        queryKey: ['website', id],
        queryFn: async () => {
            const res = await websiteApi.getById(id as string);
            return res.data.data;
        },
    });

    useEffect(() => {
        if (website) {
            setFormData({
                name: website.name,
                slug: website.slug,
                logoUrl: website.logoUrl || '',
            });
            setDesignData(website.settings || {
                primaryColor: '#3B82F6',
                fontFamily: 'Inter',
                layout: 'grid'
            });
        }
    }, [website]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => websiteApi.update(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['website', id] });
            alert('Changes saved successfully!');
        },
    });

    const publishMutation = useMutation({
        mutationFn: () => websiteApi.publish(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['website', id] });
            alert('Website is being published! Check build status in a few moments.');
        },
    });

    const handleSave = () => {
        updateMutation.mutate({
            ...formData,
            settings: designData,
        });
    };

    if (isLoading) return <div className="p-12 text-center">Loading builder...</div>;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/websites" className="text-gray-500 hover:text-gray-700">
                        ←
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Editor: {website.name}</h1>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${website.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {website.isPublished ? 'Live' : 'Draft'}
                    </span>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={website.isPublished ? website.publishedUrl : `/preview/${website.id}`}
                        target="_blank"
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Preview
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                    >
                        {updateMutation.isPending ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => publishMutation.mutate()}
                        disabled={publishMutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                        {publishMutation.isPending ? 'Publishing...' : 'Publish Site'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Settings */}
                <div className="w-80 border-r pr-6 overflow-y-auto">
                    <div className="flex border-b mb-6">
                        {(['general', 'design', 'pages'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'general' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Website Name</label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slug</label>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={formData.slug || ''}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                        <span className="text-xs text-gray-400">.pixiset.app</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Logo URL</label>
                                    <input
                                        type="text"
                                        value={formData.logoUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === 'design' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Primary Color</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={designData.primaryColor || '#3B82F6'}
                                            onChange={(e) => setDesignData({ ...designData, primaryColor: e.target.value })}
                                            className="w-10 h-10 border-none rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={designData.primaryColor || ''}
                                            onChange={(e) => setDesignData({ ...designData, primaryColor: e.target.value })}
                                            className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Font Family</label>
                                    <select
                                        value={designData.fontFamily || 'Inter'}
                                        onChange={(e) => setDesignData({ ...designData, fontFamily: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    >
                                        <option value="Inter">Inter (Sans)</option>
                                        <option value="Playfair Display">Playfair Display (Serif)</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Layout Mode</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['grid', 'masonry', 'slideshow', 'vertical'].map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => setDesignData({ ...designData, layout: l })}
                                                className={`py-2 px-3 text-xs border rounded-lg transition ${designData.layout === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {l.charAt(0).toUpperCase() + l.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'pages' && (
                            <div className="space-y-4">
                                <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition">
                                    + Add New Page
                                </button>
                                {website.pages?.map((page: any) => (
                                    <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-300 transition group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400">📄</span>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                                <div className="text-xs text-gray-500">{page.slug}</div>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Preview Area */}
                <div className="flex-1 bg-gray-100 flex flex-col p-8 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-2xl flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full border border-gray-200">
                        {/* Browser frame */}
                        <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 max-w-md bg-white border rounded-md px-3 py-1 text-[10px] text-gray-400 truncate">
                                https://{formData.slug || 'mysite'}.pixiset.app
                            </div>
                        </div>

                        {/* Actual Preview Content */}
                        <div className={`flex-1 overflow-y-auto p-12`} style={{ fontFamily: designData.fontFamily }}>
                            <div className="max-w-xl mx-auto text-center space-y-8">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="h-12 mx-auto object-contain" />
                                ) : (
                                    <div className="text-3xl font-bold" style={{ color: designData.primaryColor }}>{formData.name}</div>
                                )}

                                <nav className="flex justify-center gap-6 text-sm font-medium text-gray-500">
                                    {website.pages?.map((p: any) => <span key={p.id}>{p.title}</span>) || <span>Home</span>}
                                    <span>Portfolio</span>
                                    <span>Contact</span>
                                </nav>

                                <div className="space-y-4 pt-10">
                                    <h2 className="text-5xl font-black text-gray-900 leading-tight">Capturing moments that last forever</h2>
                                    <p className="text-xl text-gray-500 leading-relaxed">Professional photography for weddings, portraits, and commercial projects across the UK.</p>
                                </div>

                                <div className="pt-6">
                                    <button
                                        className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-transform hover:scale-105"
                                        style={{ backgroundColor: designData.primaryColor }}
                                    >
                                        View Portfolios
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-20">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest font-semibold">Live Preview Mode</p>
                </div>
            </div>
        </div>
    );
}
