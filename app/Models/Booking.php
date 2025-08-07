<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Booking
 *
 * @property int $id
 * @property string $booking_code
 * @property int|null $user_id
 * @property int $schedule_id
 * @property string $customer_name
 * @property string $customer_email
 * @property string $customer_phone
 * @property int $passenger_count
 * @property string $total_amount
 * @property string $payment_status
 * @property string $booking_status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\User|null $user
 * @property-read \App\Models\Schedule $schedule
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Payment> $payments
 * @property-read int|null $payments_count
 * @property-read bool $is_paid
 * @property-read bool $can_be_cancelled
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Booking confirmed()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking paid()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereBookingCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereBookingStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCustomerPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking wherePassengerCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereUserId($value)
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booking_code',
        'user_id',
        'schedule_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'passenger_count',
        'total_amount',
        'payment_status',
        'booking_status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'passenger_count' => 'integer',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the user that made this booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the schedule for this booking.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    /**
     * Get all payments for this booking.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Check if booking is paid.
     */
    public function getIsPaidAttribute(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Check if booking can be cancelled.
     */
    public function getCanBeCancelledAttribute(): bool
    {
        return $this->booking_status === 'confirmed' 
            && $this->schedule->departure_time > now()->addHours(24);
    }

    /**
     * Generate a unique booking code.
     */
    public static function generateBookingCode(): string
    {
        do {
            $code = 'FB' . strtoupper(substr(uniqid(), -8));
        } while (self::where('booking_code', $code)->exists());
        
        return $code;
    }

    /**
     * Scope a query to only include confirmed bookings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeConfirmed($query)
    {
        return $query->where('booking_status', 'confirmed');
    }

    /**
     * Scope a query to only include paid bookings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
}