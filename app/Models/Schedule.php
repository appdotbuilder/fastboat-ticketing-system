<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Schedule
 *
 * @property int $id
 * @property int $boat_id
 * @property int $route_id
 * @property \Illuminate\Support\Carbon $departure_time
 * @property \Illuminate\Support\Carbon $arrival_time
 * @property string $price
 * @property int $available_seats
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\Boat $boat
 * @property-read \App\Models\Route $route
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read int $booked_seats
 * @property-read bool $is_full
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule active()
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule available()
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereArrivalTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereAvailableSeats($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereBoatId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereDepartureTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereRouteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Schedule whereUpdatedAt($value)
 * @method static \Database\Factories\ScheduleFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Schedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'boat_id',
        'route_id',
        'departure_time',
        'arrival_time',
        'price',
        'available_seats',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'price' => 'decimal:2',
        'available_seats' => 'integer',
    ];

    /**
     * Get the boat for this schedule.
     */
    public function boat(): BelongsTo
    {
        return $this->belongsTo(Boat::class);
    }

    /**
     * Get the route for this schedule.
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get all bookings for this schedule.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the number of booked seats.
     */
    public function getBookedSeatsAttribute(): int
    {
        return $this->bookings()
            ->where('booking_status', 'confirmed')
            ->where('payment_status', '!=', 'failed')
            ->sum('passenger_count');
    }

    /**
     * Check if the schedule is full.
     */
    public function getIsFullAttribute(): bool
    {
        return $this->available_seats <= 0 || $this->status === 'full';
    }

    /**
     * Scope a query to only include active schedules.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include available schedules.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'active')
                    ->where('available_seats', '>', 0)
                    ->where('departure_time', '>', now());
    }
}