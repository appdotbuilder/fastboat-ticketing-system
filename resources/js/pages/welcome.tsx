import React from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="FastBoat Tickets">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 dark:from-gray-900 dark:to-blue-900 dark:text-gray-100">
                {/* Header */}
                <header className="p-6">
                    <nav className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🚤</span>
                            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">FastBoat</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    {auth.user.is_admin && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                        <div className="mb-8">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                🚤 Fast Boat Tickets
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                                Book your island adventures with ease! Fast, reliable, and comfortable boat transfers to paradise destinations.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
                            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-4">⚡</div>
                                <h3 className="text-lg font-semibold mb-2">Quick Booking</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Search schedules, select seats, and book in minutes
                                </p>
                            </div>
                            
                            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-4">💳</div>
                                <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Safe credit card processing for peace of mind
                                </p>
                            </div>
                            
                            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg">
                                <div className="text-3xl mb-4">🏝️</div>
                                <h3 className="text-lg font-semibold mb-2">Multiple Routes</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Connect to beautiful islands and destinations
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                            <Link
                                href={route('schedules.index')}
                                className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg"
                            >
                                🎫 Book Your Ticket Now
                            </Link>
                            
                            {auth.user && (
                                <Link
                                    href={route('bookings.index')}
                                    className="inline-block px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-colors dark:hover:bg-blue-900"
                                >
                                    📋 My Bookings
                                </Link>
                            )}
                        </div>

                        {/* Demo Features */}
                        <div className="mt-16 p-8 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-lg max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">🌟 What You Can Do</h2>
                            <div className="grid sm:grid-cols-2 gap-6 text-left">
                                <div>
                                    <h4 className="font-semibold mb-2">👥 For Customers:</h4>
                                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                                        <li>• Browse available schedules & routes</li>
                                        <li>• Check real-time seat availability</li>
                                        <li>• Book multiple passengers at once</li>
                                        <li>• Secure credit card payments</li>
                                        <li>• Track booking status & history</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">🔧 For Administrators:</h4>
                                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                                        <li>• Manage boats & routes</li>
                                        <li>• Create & edit schedules</li>
                                        <li>• Monitor seat availability</li>
                                        <li>• View all bookings & payments</li>
                                        <li>• Real-time analytics dashboard</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {!auth.user && (
                            <div className="mt-12 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg max-w-2xl mx-auto">
                                <h3 className="text-xl font-semibold mb-2">🚀 Ready to Get Started?</h3>
                                <p className="mb-4">Join thousands of travelers who book their boat tickets with us!</p>
                                <div className="space-x-4">
                                    <Link
                                        href={route('register')}
                                        className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-block px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Built with ❤️ for seamless island travel experiences</p>
                </footer>
            </div>
        </>
    );
}