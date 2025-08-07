<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Boat;
use App\Models\Route;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Display a listing of schedules.
     */
    public function index(Request $request)
    {
        $schedules = Schedule::with(['boat', 'route'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('boat', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('route', function ($q) use ($search) {
                    $q->where('departure_port', 'like', "%{$search}%")
                     ->orWhere('destination_port', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('departure_time', 'desc')
            ->paginate(15);
            
        return Inertia::render('admin/schedules/index', [
            'schedules' => $schedules,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new schedule.
     */
    public function create()
    {
        $boats = Boat::active()->get();
        $routes = Route::active()->get();
        
        return Inertia::render('admin/schedules/create', [
            'boats' => $boats,
            'routes' => $routes,
        ]);
    }

    /**
     * Store a newly created schedule.
     */
    public function store(StoreScheduleRequest $request)
    {
        $boat = Boat::findOrFail($request->boat_id);
        
        Schedule::create([
            'boat_id' => $request->boat_id,
            'route_id' => $request->route_id,
            'departure_time' => $request->departure_time,
            'arrival_time' => $request->arrival_time,
            'price' => $request->price,
            'available_seats' => $boat->capacity,
            'status' => $request->status ?? 'active',
        ]);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule created successfully.');
    }

    /**
     * Display the specified schedule.
     */
    public function show(Schedule $schedule)
    {
        $schedule->load(['boat', 'route', 'bookings.user']);
        
        return Inertia::render('admin/schedules/show', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Show the form for editing the specified schedule.
     */
    public function edit(Schedule $schedule)
    {
        $boats = Boat::active()->get();
        $routes = Route::active()->get();
        $schedule->load(['boat', 'route']);
        
        return Inertia::render('admin/schedules/edit', [
            'schedule' => $schedule,
            'boats' => $boats,
            'routes' => $routes,
        ]);
    }

    /**
     * Update the specified schedule.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $schedule->update($request->validated());

        return redirect()->route('admin.schedules.show', $schedule)
            ->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(Schedule $schedule)
    {
        if ($schedule->bookings()->count() > 0) {
            return back()->withErrors([
                'schedule' => 'Cannot delete schedule with existing bookings.'
            ]);
        }
        
        $schedule->delete();

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Schedule deleted successfully.');
    }
}