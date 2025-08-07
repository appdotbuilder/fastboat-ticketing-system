<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Payment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard.
     */
    public function index()
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_payments' => Booking::where('payment_status', 'pending')->count(),
            'total_revenue' => Payment::completed()->sum('amount'),
            'active_schedules' => Schedule::active()->count(),
        ];
        
        $recent_bookings = Booking::with(['schedule.boat', 'schedule.route'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        $upcoming_schedules = Schedule::with(['boat', 'route'])
            ->active()
            ->where('departure_time', '>', now())
            ->orderBy('departure_time', 'asc')
            ->take(5)
            ->get();
        
        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recent_bookings' => $recent_bookings,
            'upcoming_schedules' => $upcoming_schedules,
        ]);
    }
}