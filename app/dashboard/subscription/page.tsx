'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/lib/api-services';
import { useState } from 'react';

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(false);

    const { data: subscription } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const res = await subscriptionApi.getCurrent();
            return res.data.data;
        },
    });

    const { data: plans } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const res = await subscriptionApi.getPlans();
            return res.data.data;
        },
    });

    const handleUpgrade = async (plan: string) => {
        setLoading(true);
        try {
            const res = await subscriptionApi.createCheckout(plan);
            window.location.href = res.data.data.url;
        } catch (error) {
            console.error('Checkout failed:', error);
            setLoading(false);
        }
    };

    const handleBillingPortal = async () => {
        setLoading(true);
        try {
            const res = await subscriptionApi.getBillingPortal();
            window.location.href = res.data.data.url;
        } catch (error) {
            console.error('Portal failed:', error);
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
                <p className="text-gray-600 mt-2">Manage your plan and billing</p>
            </div>

            {/* Current Plan */}
            {subscription && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Current Plan</p>
                            <h2 className="text-3xl font-bold mt-2">{subscription.planDetails?.name || subscription.plan}</h2>
                            <p className="mt-4 opacity-90">
                                Status: <span className="font-semibold">{subscription.status}</span>
                            </p>
                            {subscription.currentPeriodEnd && (
                                <p className="mt-1 opacity-90">
                                    Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
                                </p>
                            )}
                            {subscription.cancelAtPeriodEnd && (
                                <p className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg inline-block">
                                    ⚠️ Cancels at period end
                                </p>
                            )}
                        </div>
                        {subscription.plan !== 'free' && (
                            <button
                                onClick={handleBillingPortal}
                                disabled={loading}
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                            >
                                Manage Billing
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Available Plans */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans?.map((plan: any) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-xl shadow-sm border-2 p-8 ${subscription?.plan === plan.id
                                    ? 'border-blue-600'
                                    : 'border-gray-200'
                                }`}
                        >
                            {subscription?.plan === plan.id && (
                                <div className="mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                                        Current Plan
                                    </span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    £{plan.price}
                                </span>
                                <span className="text-gray-600 ml-2">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">
                                        {plan.features.websites === -1 ? 'Unlimited' : plan.features.websites} Website{plan.features.websites !== 1 ? 's' : ''}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">
                                        {plan.features.galleries === -1 ? 'Unlimited' : plan.features.galleries} Galleries
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">
                                        {plan.features.storage === -1 ? 'Unlimited' : `${plan.features.storage / (1024 * 1024 * 1024)}GB`} Storage
                                    </span>
                                </li>
                                {plan.features.customDomain && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Custom Domain</span>
                                    </li>
                                )}
                                {plan.features.premiumTemplates && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Premium Templates</span>
                                    </li>
                                )}
                            </ul>

                            {subscription?.plan !== plan.id && plan.id !== 'free' && (
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Upgrade'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
