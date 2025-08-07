<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Booking>
     */
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $schedule = Schedule::factory()->create();
        $passengerCount = $this->faker->numberBetween(1, 4);
        $totalAmount = floatval($schedule->price) * $passengerCount;
        
        return [
            'booking_code' => Booking::generateBookingCode(),
            'user_id' => User::factory(),
            'schedule_id' => $schedule->id,
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'passenger_count' => $passengerCount,
            'total_amount' => $totalAmount,
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'failed']),
            'booking_status' => 'confirmed',
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}