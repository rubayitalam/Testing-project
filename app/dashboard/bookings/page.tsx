'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api-services';
import { format } from 'date-fns';

export default function BookingsPage() {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await bookingApi.getAll();
            return res.data.data;
        },
    });

    const queryClient = useQueryClient();

    const confirmMutation = useMutation({
        mutationFn: (id: string) => bookingApi.confirm(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => bookingApi.cancel(id, 'User cancelled from dashboard'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        completed: 'bg-blue-100 text-blue-700',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-600 mt-2">Manage your photography sessions</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                    + New Booking
                </button>
            </div>

            {bookings && bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6">Your bookings will appear here</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings?.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">
                                            {booking.client?.firstName} {booking.client?.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">{booking.client?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{booking.eventType}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-medium">
                                            {format(new Date(booking.eventDate), 'dd MMM yyyy')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(booking.eventDate), 'HH:mm')} ({booking.duration} min)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">£{booking.price}</div>
                                        {booking.deposit > 0 && (
                                            <div className="text-[10px] text-gray-400 uppercase font-bold">Deposit Paid: £{booking.deposit}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[booking.status as keyof typeof statusColors]}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => confirmMutation.mutate(booking.id)}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Cancel this booking?')) cancelMutation.mutate(booking.id)
                                                    }}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 transition">
                                                ⚙️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
