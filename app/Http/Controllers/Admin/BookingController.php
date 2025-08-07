<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request)
    {
        $bookings = Booking::with(['user', 'schedule.boat', 'schedule.route'])
            ->when($request->search, function ($query, $search) {
                $query->where('booking_code', 'like', "%{$search}%")
                     ->orWhere('customer_name', 'like', "%{$search}%")
                     ->orWhere('customer_email', 'like', "%{$search}%");
            })
            ->when($request->payment_status, function ($query, $status) {
                $query->where('payment_status', $status);
            })
            ->when($request->booking_status, function ($query, $status) {
                $query->where('booking_status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'payment_status', 'booking_status']),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        $booking->load(['user', 'schedule.boat', 'schedule.route', 'payments']);
        
        return Inertia::render('admin/bookings/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Update booking status.
     */
    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'booking_status' => 'required|in:confirmed,cancelled',
            'payment_status' => 'required|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
        ]);
        
        $booking->update($request->only(['booking_status', 'payment_status', 'notes']));
        
        return back()->with('success', 'Booking updated successfully.');
    }
}