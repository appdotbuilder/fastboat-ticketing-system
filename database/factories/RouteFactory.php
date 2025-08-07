<?php

namespace Database\Factories;

use App\Models\Route;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Route>
 */
class RouteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Route>
     */
    protected $model = Route::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ports = ['Bali', 'Lombok', 'Gili Trawangan', 'Gili Air', 'Nusa Penida', 'Nusa Lembongan'];
        
        return [
            'departure_port' => $this->faker->randomElement($ports),
            'destination_port' => $this->faker->randomElement($ports),
            'duration_minutes' => $this->faker->numberBetween(30, 180),
            'base_price' => $this->faker->numberBetween(150000, 500000),
            'status' => 'active',
        ];
    }
}