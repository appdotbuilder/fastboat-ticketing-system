<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Route
 *
 * @property int $id
 * @property string $departure_port
 * @property string $destination_port
 * @property int $duration_minutes
 * @property string $base_price
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Schedule> $schedules
 * @property-read int|null $schedules_count
 * @property-read string $route_name
 * @property-read string $duration_formatted
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Route active()
 * @method static \Illuminate\Database\Eloquent\Builder|Route newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Route newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Route query()
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereBasePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereDeparturePort($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereDestinationPort($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Route whereUpdatedAt($value)
 * @method static \Database\Factories\RouteFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Route extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'departure_port',
        'destination_port',
        'duration_minutes',
        'base_price',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'duration_minutes' => 'integer',
        'base_price' => 'decimal:2',
    ];

    /**
     * Get all schedules for this route.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the route name attribute.
     */
    public function getRouteNameAttribute(): string
    {
        return "{$this->departure_port} → {$this->destination_port}";
    }

    /**
     * Get formatted duration.
     */
    public function getDurationFormattedAttribute(): string
    {
        $hours = intval($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours > 0) {
            return $minutes > 0 ? "{$hours}h {$minutes}m" : "{$hours}h";
        }
        
        return "{$minutes}m";
    }

    /**
     * Scope a query to only include active routes.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}