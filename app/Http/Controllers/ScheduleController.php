<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display available schedules.
     */
    public function index(Request $request)
    {
        $schedules = Schedule::with(['boat', 'route'])
            ->available()
            ->when($request->departure_port, function ($query, $port) {
                $query->whereHas('route', function ($q) use ($port) {
                    $q->where('departure_port', $port);
                });
            })
            ->when($request->destination_port, function ($query, $port) {
                $query->whereHas('route', function ($q) use ($port) {
                    $q->where('destination_port', $port);
                });
            })
            ->when($request->departure_date, function ($query, $date) {
                $query->whereDate('departure_time', $date);
            })
            ->orderBy('departure_time', 'asc')
            ->get();

        // Get unique ports for filters
        $ports = Schedule::with('route')
            ->available()
            ->get()
            ->flatMap(function ($schedule) {
                return [$schedule->route->departure_port, $schedule->route->destination_port];
            })
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('schedules', [
            'schedules' => $schedules,
            'ports' => $ports,
            'filters' => $request->only(['departure_port', 'destination_port', 'departure_date']),
        ]);
    }

    /**
     * Display the specified schedule.
     */
    public function show(Schedule $schedule)
    {
        $schedule->load(['boat', 'route']);
        
        return Inertia::render('schedule-detail', [
            'schedule' => $schedule,
        ]);
    }
}