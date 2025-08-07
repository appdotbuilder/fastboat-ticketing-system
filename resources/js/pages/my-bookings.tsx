import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Booking {
    id: number;
    booking_code: string;
    customer_name: string;
    passenger_count: number;
    total_amount: string;
    payment_status: string;
    booking_status: string;
    created_at: string;
    schedule: {
        departure_time: string;
        boat: {
            name: string;
        };
        route: {
            departure_port: string;
            destination_port: string;
        };
    };
}

interface Props {
    bookings: {
        data: Booking[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    [key: string]: unknown;
}

export default function MyBookings({ bookings }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <AppShell>
            <Head title="My Bookings" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📋 My Bookings</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {bookings.meta.total} booking{bookings.meta.total !== 1 ? 's' : ''} found
                    </p>
                </div>

                {bookings.data.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="text-4xl mb-4">🎫</div>
                        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Start your adventure by booking your first trip!
                        </p>
                        <Link
                            href={route('schedules.index')}
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Schedules
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking) => (
                            <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    {/* Booking Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <div className="font-mono text-sm font-semibold text-blue-600">
                                                {booking.booking_code}
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                                                    {booking.payment_status}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                                                    {booking.booking_status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Route</div>
                                                <div className="font-semibold">
                                                    {booking.schedule.route.departure_port} → {booking.schedule.route.destination_port}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                                                <div className="font-semibold">{formatDateTime(booking.schedule.departure_time)}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Boat</div>
                                                <div className="font-semibold">{booking.schedule.boat.name}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Actions */}
                                    <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col lg:items-end">
                                        <div className="text-xl font-bold text-blue-600 mb-1">
                                            {formatPrice(booking.total_amount)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {booking.passenger_count} passenger{booking.passenger_count !== 1 ? 's' : ''}
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Link
                                                href={route('bookings.show', booking.id)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                            >
                                                View Details
                                            </Link>
                                            
                                            {booking.payment_status === 'pending' && (
                                                <Link
                                                    href={route('payments.create', booking.id)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    Pay Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {bookings.meta.last_page > 1 && (
                            <div className="flex justify-center space-x-2 mt-6">
                                {bookings.links.map((link, index) => (
                                    <div key={index}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                                    link.active 
                                                        ? 'bg-blue-600 text-white border-blue-600' 
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}