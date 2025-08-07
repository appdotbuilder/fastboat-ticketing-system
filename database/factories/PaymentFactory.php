<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Payment>
     */
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'payment_method' => $this->faker->randomElement(['credit_card', 'debit_card']),
            'amount' => $this->faker->randomFloat(2, 100000, 1000000),
            'transaction_id' => 'TXN' . strtoupper(uniqid()),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'payment_details' => [
                'card_last_four' => $this->faker->numerify('####'),
                'cardholder_name' => $this->faker->name(),
            ],
            'paid_at' => $this->faker->optional()->dateTimeBetween('-1 month'),
        ];
    }
}