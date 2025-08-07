<?php

namespace Database\Seeders;

use App\Models\Route;
use Illuminate\Database\Seeder;

class RouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $routes = [
            [
                'departure_port' => 'Bali',
                'destination_port' => 'Gili Trawangan',
                'duration_minutes' => 90,
                'base_price' => 350000,
                'status' => 'active',
            ],
            [
                'departure_port' => 'Bali',
                'destination_port' => 'Lombok',
                'duration_minutes' => 120,
                'base_price' => 450000,
                'status' => 'active',
            ],
            [
                'departure_port' => 'Lombok',
                'destination_port' => 'Gili Air',
                'duration_minutes' => 45,
                'base_price' => 200000,
                'status' => 'active',
            ],
            [
                'departure_port' => 'Gili Trawangan',
                'destination_port' => 'Bali',
                'duration_minutes' => 90,
                'base_price' => 350000,
                'status' => 'active',
            ],
            [
                'departure_port' => 'Lombok',
                'destination_port' => 'Bali',
                'duration_minutes' => 120,
                'base_price' => 450000,
                'status' => 'active',
            ],
            [
                'departure_port' => 'Gili Air',
                'destination_port' => 'Lombok',
                'duration_minutes' => 45,
                'base_price' => 200000,
                'status' => 'active',
            ],
        ];

        foreach ($routes as $route) {
            Route::create($route);
        }
    }
}