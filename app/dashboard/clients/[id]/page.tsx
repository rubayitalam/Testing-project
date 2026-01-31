'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/api-services';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: client, isLoading, error } = useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            const res = await clientApi.getById(id as string);
            return res.data.data;
        },
    });

    if (isLoading) return <div className="text-center py-12">Loading client...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error loading client</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/clients" className="text-blue-600 hover:text-blue-700 font-medium">
                    ← Back to Clients
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                            {client.firstName?.[0] || client.email[0].toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{client.firstName} {client.lastName}</h1>
                        <p className="text-gray-500 mt-1">{client.email}</p>
                        {client.phone && <p className="text-gray-500 text-sm mt-1">{client.phone}</p>}

                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {client.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider border border-gray-200">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{client.bookings?.length || 0}</div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Bookings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{client.websites?.length || 0}</div>
                                <div className="text-xs text-gray-500 uppercase font-semibold">Projects</div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
                            Send Email
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Internal Notes</h3>
                        <textarea
                            className="w-full h-32 p-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Add private notes about this client..."
                            defaultValue={client.notes}
                        ></textarea>
                        <button className="w-full mt-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            Save Note
                        </button>
                    </div>
                </div>

                {/* History Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Booking History</h2>
                            <button className="text-sm font-semibold text-blue-600">+ New Booking</button>
                        </div>
                        {client.bookings?.length > 0 ? (
                            <div className="divide-y">
                                {client.bookings.map((booking: any) => (
                                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl text-xl font-bold">
                                                📅
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{booking.service || 'Photography Session'}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(booking.date).toLocaleDateString('en-GB')} at {booking.time}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 italic">No bookings found for this client.</div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900">Associated Projects</h2>
                        </div>
                        {client.websites?.length > 0 ? (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {client.websites.map((site: any) => (
                                    <Link key={site.id} href={`/dashboard/websites/${site.id}`} className="group p-4 border rounded-xl hover:border-blue-500 transition">
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">{site.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{site.slug}.pixiset.app</div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Published</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 italic">No associated projects found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
