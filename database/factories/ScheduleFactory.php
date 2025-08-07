<?php

namespace Database\Factories;

use App\Models\Boat;
use App\Models\Route;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Schedule>
     */
    protected $model = Schedule::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $boat = Boat::factory()->create();
        $route = Route::factory()->create();
        
        $departureTime = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $arrivalTime = (clone $departureTime)->modify('+' . $route->duration_minutes . ' minutes');
        
        return [
            'boat_id' => $boat->id,
            'route_id' => $route->id,
            'departure_time' => $departureTime,
            'arrival_time' => $arrivalTime,
            'price' => $this->faker->numberBetween(200000, 600000),
            'available_seats' => $boat->capacity,
            'status' => 'active',
        ];
    }
}