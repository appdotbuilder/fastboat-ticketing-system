import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Booking {
    id: number;
    booking_code: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    passenger_count: number;
    total_amount: string;
    payment_status: string;
    booking_status: string;
    notes: string | null;
    created_at: string;
    schedule: {
        id: number;
        departure_time: string;
        arrival_time: string;
        price: string;
        boat: {
            name: string;
        };
        route: {
            departure_port: string;
            destination_port: string;
            duration_formatted: string;
        };
    };
    payments: Array<{
        id: number;
        amount: string;
        status: string;
        transaction_id: string | null;
        paid_at: string | null;
    }>;
}

interface Props {
    booking: Booking;
    [key: string]: unknown;
}

export default function BookingDetail({ booking }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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
            case 'completed':
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
            <Head title={`Booking ${booking.booking_code}`} />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🎫 Booking Details
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Booking Code: <span className="font-mono font-semibold">{booking.booking_code}</span>
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Payment Status</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.payment_status)}`}>
                            {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                        </span>
                        
                        {booking.payment_status === 'pending' && (
                            <div className="mt-3">
                                <Link
                                    href={route('payments.create', booking.id)}
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Pay Now
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">Booking Status</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.booking_status)}`}>
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Trip Information</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-center flex-1">
                                <div className="font-bold text-lg">{booking.schedule.route.departure_port}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-blue-600 text-xl">🚤</div>
                                <div className="text-xs text-gray-500">{booking.schedule.route.duration_formatted}</div>
                            </div>
                            
                            <div className="text-center flex-1">
                                <div className="font-bold text-lg">{booking.schedule.route.destination_port}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Arrival</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Boat</div>
                                <div className="font-semibold">{booking.schedule.boat.name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Passengers</div>
                                <div className="font-semibold">{booking.passenger_count}</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                                <div className="font-semibold">{formatDateTime(booking.schedule.departure_time)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Arrival</div>
                                <div className="font-semibold">{formatDateTime(booking.schedule.arrival_time)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                            <div className="font-semibold">{booking.customer_name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                            <div className="font-semibold">{booking.customer_email}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                            <div className="font-semibold">{booking.customer_phone}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Booking Date</div>
                            <div className="font-semibold">{formatDateTime(booking.created_at)}</div>
                        </div>
                    </div>
                    
                    {booking.notes && (
                        <div className="mt-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Special Notes</div>
                            <div className="font-semibold">{booking.notes}</div>
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Price per ticket:</span>
                            <span>{formatPrice(booking.schedule.price)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Number of passengers:</span>
                            <span>{booking.passenger_count}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>Total Amount:</span>
                            <span className="text-blue-600">{formatPrice(booking.total_amount)}</span>
                        </div>
                    </div>
                    
                    {booking.payments && booking.payments.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-3">Payment History</h3>
                            <div className="space-y-2">
                                {booking.payments.map((payment) => (
                                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div>
                                            <div className="font-medium">{formatPrice(payment.amount)}</div>
                                            {payment.transaction_id && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Transaction: {payment.transaction_id}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </div>
                                            {payment.paid_at && (
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    {formatDateTime(payment.paid_at)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                    <Link
                        href={route('bookings.index')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        ← Back to My Bookings
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}