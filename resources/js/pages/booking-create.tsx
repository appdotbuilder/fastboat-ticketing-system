import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Schedule {
    id: number;
    departure_time: string;
    arrival_time: string;
    price: string;
    available_seats: number;
    boat: {
        name: string;
        capacity: number;
    };
    route: {
        departure_port: string;
        destination_port: string;
        duration_formatted: string;
    };
}

interface Props {
    schedule: Schedule;
    [key: string]: unknown;
}

export default function BookingCreate({ schedule }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        schedule_id: schedule.id,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        passenger_count: 1,
        notes: '',
    });

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
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

    const totalPrice = parseFloat(schedule.price) * data.passenger_count;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    return (
        <AppShell>
            <Head title="Book Your Trip" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎫 Book Your Trip</h1>
                    <p className="text-gray-600 dark:text-gray-400">Complete your booking details</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Trip Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Trip Details</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-center flex-1">
                                    <div className="font-bold text-lg">{schedule.route.departure_port}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-blue-600 text-xl">🚤</div>
                                    <div className="text-xs text-gray-500">{schedule.route.duration_formatted}</div>
                                </div>
                                
                                <div className="text-center flex-1">
                                    <div className="font-bold text-lg">{schedule.route.destination_port}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Arrival</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Boat</div>
                                    <div className="font-semibold">{schedule.boat.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Available Seats</div>
                                    <div className="font-semibold">{schedule.available_seats}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Departure Time</div>
                                <div className="font-semibold">{formatDateTime(schedule.departure_time)}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Arrival Time</div>
                                <div className="font-semibold">{formatDateTime(schedule.arrival_time)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Booking Information</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Number of Passengers *
                                </label>
                                <select
                                    value={data.passenger_count}
                                    onChange={(e) => setData('passenger_count', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    {Array.from({ length: Math.min(schedule.available_seats, 10) }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>
                                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                                        </option>
                                    ))}
                                </select>
                                {errors.passenger_count && (
                                    <div className="text-red-600 text-sm mt-1">{errors.passenger_count}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                                {errors.customer_name && (
                                    <div className="text-red-600 text-sm mt-1">{errors.customer_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                                {errors.customer_email && (
                                    <div className="text-red-600 text-sm mt-1">{errors.customer_email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                                {errors.customer_phone && (
                                    <div className="text-red-600 text-sm mt-1">{errors.customer_phone}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Special Notes (Optional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Any special requests or notes..."
                                />
                                {errors.notes && (
                                    <div className="text-red-600 text-sm mt-1">{errors.notes}</div>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="border-t pt-4 mt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Price per ticket:</span>
                                        <span>{formatPrice(schedule.price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Passengers:</span>
                                        <span>{data.passenger_count}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-600">{formatPrice(totalPrice.toString())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Booking...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}