'use client';

import { useQuery } from '@tanstack/react-query';
import { templateApi } from '@/lib/api-services';

export default function TemplatesPage() {
    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: async () => {
            const res = await templateApi.getAll();
            return res.data.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading templates...</div>;
    }

    const categories = [...new Set(templates?.map((t: any) => t.category) || [])];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Template Marketplace</h1>
                <p className="text-gray-600 mt-2">Choose a template for your next website</p>
            </div>

            {categories.map((category) => (
                <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates
                            ?.filter((t: any) => t.category === category)
                            .map((template: any) => (
                                <div
                                    key={template.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                                >
                                    <div className="relative">
                                        <img
                                            src={template.thumbnailUrl}
                                            alt={template.name}
                                            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        {template.isFeatured && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
                                                Featured
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                            </div>
                                            {template.isPremium && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                                    Premium
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="text-sm font-medium">{template.rating}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {template.usageCount} uses
                                            </div>
                                        </div>

                                        {template.isPremium && template.price && (
                                            <div className="mb-4">
                                                <span className="text-2xl font-bold text-gray-900">£{template.price}</span>
                                                <span className="text-gray-600 ml-2">one-time</span>
                                            </div>
                                        )}

                                        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                                            Use Template
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
