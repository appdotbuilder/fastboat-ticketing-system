<?php

namespace Database\Factories;

use App\Models\Boat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Boat>
 */
class BoatFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Boat>
     */
    protected $model = Boat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true) . ' ' . $this->faker->randomElement(['Explorer', 'Cruiser', 'Runner', 'Rider']),
            'capacity' => $this->faker->numberBetween(20, 100),
            'description' => $this->faker->sentence(),
            'status' => 'active',
        ];
    }
}