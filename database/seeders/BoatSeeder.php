<?php

namespace Database\Seeders;

use App\Models\Boat;
use Illuminate\Database\Seeder;

class BoatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boats = [
            [
                'name' => 'Ocean Explorer',
                'capacity' => 50,
                'description' => 'Fast and comfortable boat with air conditioning',
                'status' => 'active',
            ],
            [
                'name' => 'Island Hopper',
                'capacity' => 30,
                'description' => 'Smaller boat perfect for scenic routes',
                'status' => 'active',
            ],
            [
                'name' => 'Blue Wave',
                'capacity' => 75,
                'description' => 'Large capacity boat with modern amenities',
                'status' => 'active',
            ],
            [
                'name' => 'Sea Breeze',
                'capacity' => 40,
                'description' => 'Mid-size boat with outdoor seating',
                'status' => 'active',
            ],
        ];

        foreach ($boats as $boat) {
            Boat::create($boat);
        }
    }
}