'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState<any>({});
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                businessName: user.businessName || '',
                email: user.email,
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => userApi.updateMe(data),
        onSuccess: () => {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-2">Manage your personal information and business details</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Profile Picture</h2>
                            <p className="text-sm text-gray-500 mt-1">PNG or JPG, max 5MB</p>
                            <button className="text-sm font-bold text-blue-600 mt-3 hover:underline">Change Picture</button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName || ''}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName || ''}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Business Name</label>
                        <input
                            type="text"
                            value={formData.businessName || ''}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            placeholder="e.g. Dream Photography"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            disabled
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl outline-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">Contact support to change your email address.</p>
                    </div>

                    <div className="pt-6 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isSaved && (
                                <span className="text-green-600 text-sm font-bold flex items-center gap-1 animate-in slide-in-from-left duration-300">
                                    ✅ Saved successfully
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-red-50 p-8 rounded-2xl border border-red-100">
                <h3 className="text-red-900 font-bold mb-2">Danger Zone</h3>
                <p className="text-red-700 text-sm mb-6">Once you delete your account, there is no going back. All your websites and galleries will be permanently removed.</p>
                <button className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
