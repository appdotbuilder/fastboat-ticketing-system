<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Show the form for creating a new booking.
     */
    public function create(Schedule $schedule)
    {
        $schedule->load(['boat', 'route']);
        
        if ($schedule->is_full || $schedule->status !== 'active') {
            return redirect()->route('schedules.index')
                ->with('error', 'This schedule is no longer available.');
        }
        
        return Inertia::render('booking-create', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreBookingRequest $request)
    {
        $schedule = Schedule::findOrFail($request->schedule_id);
        
        // Check availability
        if ($schedule->available_seats < $request->passenger_count) {
            return back()->withErrors([
                'passenger_count' => 'Not enough seats available.'
            ]);
        }
        
        // Create booking
        $booking = Booking::create([
            'booking_code' => Booking::generateBookingCode(),
            'user_id' => auth()->id(),
            'schedule_id' => $schedule->id,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'passenger_count' => $request->passenger_count,
            'total_amount' => $schedule->price * $request->passenger_count,
            'notes' => $request->notes,
        ]);
        
        // Update available seats
        $schedule->decrement('available_seats', $request->passenger_count);
        
        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking created successfully! Please proceed with payment.');
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Check if user can access this booking
        if (!auth()->check() || (auth()->id() !== $booking->user_id && !auth()->user()->is_admin)) {
            abort(403);
        }
        
        $booking->load(['schedule.boat', 'schedule.route', 'payments']);
        
        return Inertia::render('booking-detail', [
            'booking' => $booking,
        ]);
    }

    /**
     * Display user's bookings.
     */
    public function index()
    {
        $bookings = Booking::with(['schedule.boat', 'schedule.route'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return Inertia::render('my-bookings', [
            'bookings' => $bookings,
        ]);
    }
}