<?php

namespace Database\Seeders;

use App\Models\Boat;
use App\Models\Route;
use App\Models\Schedule;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boats = Boat::all();
        $routes = Route::all();
        
        // Generate schedules for the next 30 days
        for ($day = 0; $day < 30; $day++) {
            $date = Carbon::now()->addDays($day);
            
            foreach ($routes as $route) {
                // Create 2-3 schedules per route per day
                $schedulesPerDay = random_int(2, 3);
                
                for ($i = 0; $i < $schedulesPerDay; $i++) {
                    $boat = $boats->random();
                    
                    // Random departure times throughout the day
                    $departureHour = random_int(6, 18);
                    $departureMinute = random_int(0, 59);
                    
                    $departureTime = $date->copy()
                        ->setHour($departureHour)
                        ->setMinute($departureMinute)
                        ->setSecond(0);
                    
                    $arrivalTime = $departureTime->copy()
                        ->addMinutes($route->duration_minutes);
                    
                    // Vary price slightly from base price
                    $priceVariation = random_int(-50000, 100000);
                    $price = max(floatval($route->base_price) + $priceVariation, 100000);
                    
                    Schedule::create([
                        'boat_id' => $boat->id,
                        'route_id' => $route->id,
                        'departure_time' => $departureTime,
                        'arrival_time' => $arrivalTime,
                        'price' => $price,
                        'available_seats' => $boat->capacity,
                        'status' => 'active',
                    ]);
                }
            }
        }
    }
}