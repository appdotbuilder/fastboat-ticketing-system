<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Show payment form.
     */
    public function create(Booking $booking)
    {
        // Check if user can access this booking
        if (!auth()->check() || (auth()->id() !== $booking->user_id && !auth()->user()->is_admin)) {
            abort(403);
        }
        
        if ($booking->payment_status === 'paid') {
            return redirect()->route('bookings.show', $booking)
                ->with('info', 'This booking has already been paid.');
        }
        
        $booking->load(['schedule.boat', 'schedule.route']);
        
        return Inertia::render('payment-create', [
            'booking' => $booking,
        ]);
    }

    /**
     * Process payment.
     */
    public function store(Request $request, Booking $booking)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'card_number' => 'required|string',
            'expiry_month' => 'required|integer|min:1|max:12',
            'expiry_year' => 'required|integer|min:' . date('Y'),
            'cvv' => 'required|string|size:3',
            'cardholder_name' => 'required|string',
        ]);
        
        // Check if user can access this booking
        if (!auth()->check() || auth()->id() !== $booking->user_id) {
            abort(403);
        }
        
        // Simulate payment processing
        $isSuccess = $this->processPayment($request->all(), $booking);
        
        if ($isSuccess) {
            // Create payment record
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'payment_method' => $request->payment_method,
                'amount' => $booking->total_amount,
                'transaction_id' => 'TXN' . strtoupper(uniqid()),
                'status' => 'completed',
                'payment_details' => [
                    'card_last_four' => substr($request->card_number, -4),
                    'cardholder_name' => $request->cardholder_name,
                ],
                'paid_at' => now(),
            ]);
            
            // Update booking payment status
            $booking->update(['payment_status' => 'paid']);
            
            return redirect()->route('bookings.show', $booking)
                ->with('success', 'Payment successful! Your booking is confirmed.');
        }
        
        return back()->withErrors(['payment' => 'Payment failed. Please try again.']);
    }
    
    /**
     * Simulate payment processing.
     */
    protected function processPayment(array $paymentData, Booking $booking): bool
    {
        // Simulate payment gateway processing
        // In real implementation, this would integrate with Stripe, PayPal, etc.
        
        // For demo purposes, simulate 95% success rate
        return random_int(1, 100) <= 95;
    }
}