import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Booking {
    id: number;
    booking_code: string;
    customer_name: string;
    total_amount: string;
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
    booking: Booking;
    [key: string]: unknown;
}

export default function PaymentCreate({ booking }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        card_number: '',
        expiry_month: 1,
        expiry_year: new Date().getFullYear(),
        cvv: '',
        cardholder_name: '',
    });

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseFloat(price));
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setData('card_number', formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payments.store', booking.id));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <AppShell>
            <Head title="Payment" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💳 Payment</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete your payment for booking {booking.booking_code}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Booking Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Booking Code:</span>
                                <span className="font-mono font-semibold">{booking.booking_code}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                                <span className="font-semibold">{booking.customer_name}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Route:</span>
                                <span className="font-semibold">
                                    {booking.schedule.route.departure_port} → {booking.schedule.route.destination_port}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Boat:</span>
                                <span className="font-semibold">{booking.schedule.boat.name}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Departure:</span>
                                <span className="font-semibold">
                                    {new Date(booking.schedule.departure_time).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            
                            <hr className="border-gray-200 dark:border-gray-700" />
                            
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span>Total Amount:</span>
                                <span className="text-blue-600">{formatPrice(booking.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                </select>
                                {errors.payment_method && (
                                    <div className="text-red-600 text-sm mt-1">{errors.payment_method}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.cardholder_name}
                                    onChange={(e) => setData('cardholder_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="John Doe"
                                    required
                                />
                                {errors.cardholder_name && (
                                    <div className="text-red-600 text-sm mt-1">{errors.cardholder_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    value={data.card_number}
                                    onChange={handleCardNumberChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    required
                                />
                                {errors.card_number && (
                                    <div className="text-red-600 text-sm mt-1">{errors.card_number}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Month *
                                    </label>
                                    <select
                                        value={data.expiry_month}
                                        onChange={(e) => setData('expiry_month', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        {months.map(month => (
                                            <option key={month} value={month}>
                                                {month.toString().padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.expiry_month && (
                                        <div className="text-red-600 text-sm mt-1">{errors.expiry_month}</div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Year *
                                    </label>
                                    <select
                                        value={data.expiry_year}
                                        onChange={(e) => setData('expiry_year', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.expiry_year && (
                                        <div className="text-red-600 text-sm mt-1">{errors.expiry_year}</div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cvv}
                                        onChange={(e) => setData('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
                                        placeholder="123"
                                        maxLength={3}
                                        required
                                    />
                                    {errors.cvv && (
                                        <div className="text-red-600 text-sm mt-1">{errors.cvv}</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    🔒 Your payment information is secure and encrypted. 
                                    This is a demo payment system for testing purposes.
                                </p>
                            </div>

                            {'payment' in errors && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                                    <p className="text-red-800 dark:text-red-200">{String(errors.payment)}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing Payment...' : `Pay ${formatPrice(booking.total_amount)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}