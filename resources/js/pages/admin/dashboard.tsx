import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Stats {
    total_bookings: number;
    pending_payments: number;
    total_revenue: string;
    active_schedules: number;
}

interface Booking {
    id: number;
    booking_code: string;
    customer_name: string;
    total_amount: string;
    payment_status: string;
    created_at: string;
    schedule: {
        route: {
            departure_port: string;
            destination_port: string;
        };
    };
}

interface Schedule {
    id: number;
    departure_time: string;
    available_seats: number;
    boat: {
        name: string;
    };
    route: {
        departure_port: string;
        destination_port: string;
    };
}

interface Props {
    stats: Stats;
    recent_bookings: Booking[];
    upcoming_schedules: Schedule[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recent_bookings, upcoming_schedules }: Props) {
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <AppShell>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🚤 Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">FastBoat ticket management system</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">📋</div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{stats.total_bookings}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">⏳</div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">💰</div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{formatPrice(stats.total_revenue)}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">🗓️</div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">{stats.active_schedules}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Active Schedules</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href={route('admin.schedules.create')}
                            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                            <div className="text-2xl mr-3">➕</div>
                            <div>
                                <div className="font-semibold">Add Schedule</div>
                                <div className="text-sm">Create new boat schedule</div>
                            </div>
                        </Link>
                        
                        <Link
                            href={route('admin.bookings.index')}
                            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                        >
                            <div className="text-2xl mr-3">👥</div>
                            <div>
                                <div className="font-semibold">View Bookings</div>
                                <div className="text-sm">Manage all bookings</div>
                            </div>
                        </Link>
                        
                        <Link
                            href={route('admin.schedules.index')}
                            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                        >
                            <div className="text-2xl mr-3">📅</div>
                            <div>
                                <div className="font-semibold">Manage Schedules</div>
                                <div className="text-sm">Edit existing schedules</div>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Recent Bookings</h2>
                            <Link
                                href={route('admin.bookings.index')}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View All →
                            </Link>
                        </div>
                        
                        {recent_bookings.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No recent bookings
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recent_bookings.map((booking) => (
                                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-sm">{booking.booking_code}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {booking.customer_name} • {booking.schedule.route.departure_port} → {booking.schedule.route.destination_port}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-sm">{formatPrice(booking.total_amount)}</div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                                                {booking.payment_status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Schedules */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Upcoming Schedules</h2>
                            <Link
                                href={route('admin.schedules.index')}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                View All →
                            </Link>
                        </div>
                        
                        {upcoming_schedules.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No upcoming schedules
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcoming_schedules.map((schedule) => (
                                    <div key={schedule.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-sm">{schedule.boat.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {schedule.route.departure_port} → {schedule.route.destination_port}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-sm">{formatDateTime(schedule.departure_time)}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {schedule.available_seats} seats left
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}