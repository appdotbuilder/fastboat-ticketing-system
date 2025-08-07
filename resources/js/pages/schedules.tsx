import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Schedule {
    id: number;
    departure_time: string;
    arrival_time: string;
    price: string;
    available_seats: number;
    status: string;
    boat: {
        id: number;
        name: string;
        capacity: number;
    };
    route: {
        id: number;
        departure_port: string;
        destination_port: string;
        duration_minutes: number;
        route_name: string;
        duration_formatted: string;
    };
}

interface Props {
    schedules: Schedule[];
    ports: string[];
    filters: {
        departure_port?: string;
        destination_port?: string;
        departure_date?: string;
    };
    [key: string]: unknown;
}

export default function Schedules({ schedules, ports, filters }: Props) {
    const handleFilter = (filterData: Record<string, string>) => {
        router.get(route('schedules.index'), filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
            })
        };
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    return (
        <AppShell>
            <Head title="Available Schedules" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🚤 Available Schedules</h1>
                    <p className="text-gray-600 dark:text-gray-400">Find and book your perfect boat trip</p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Filter Schedules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">From</label>
                            <select
                                value={filters.departure_port || ''}
                                onChange={(e) => handleFilter({ ...filters, departure_port: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="">All Ports</option>
                                {ports.map((port) => (
                                    <option key={port} value={port}>
                                        {port}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">To</label>
                            <select
                                value={filters.destination_port || ''}
                                onChange={(e) => handleFilter({ ...filters, destination_port: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="">All Destinations</option>
                                {ports.map((port) => (
                                    <option key={port} value={port}>
                                        {port}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                value={filters.departure_date || ''}
                                onChange={(e) => handleFilter({ ...filters, departure_date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                onClick={() => handleFilter({})}
                                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedules List */}
                <div className="space-y-4">
                    {schedules.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-lg font-semibold mb-2">No schedules found</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search filters or check back later
                            </p>
                        </div>
                    ) : (
                        schedules.map((schedule) => {
                            const departure = formatDateTime(schedule.departure_time);
                            const arrival = formatDateTime(schedule.arrival_time);
                            
                            return (
                                <div key={schedule.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Route Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{departure.time}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{departure.date}</div>
                                                    <div className="font-semibold">{schedule.route.departure_port}</div>
                                                </div>
                                                
                                                <div className="flex-1 text-center">
                                                    <div className="text-xs text-gray-500 mb-1">{schedule.route.duration_formatted}</div>
                                                    <div className="flex items-center justify-center">
                                                        <div className="h-px bg-gray-300 flex-1"></div>
                                                        <div className="px-2 text-blue-600">🚤</div>
                                                        <div className="h-px bg-gray-300 flex-1"></div>
                                                    </div>
                                                    <div className="text-sm font-medium mt-1">{schedule.boat.name}</div>
                                                </div>
                                                
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{arrival.time}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{arrival.date}</div>
                                                    <div className="font-semibold">{schedule.route.destination_port}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Info */}
                                        <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col lg:items-end">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {formatPrice(schedule.price)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {schedule.available_seats} seats available
                                            </div>
                                            
                                            {schedule.available_seats > 0 ? (
                                                <Link
                                                    href={route('bookings.create', schedule.id)}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                                                >
                                                    Book Now
                                                </Link>
                                            ) : (
                                                <div className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                                                    Fully Booked
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppShell>
    );
}