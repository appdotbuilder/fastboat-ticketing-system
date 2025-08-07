<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('boat_id')->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->constrained()->onDelete('cascade');
            $table->datetime('departure_time');
            $table->datetime('arrival_time');
            $table->decimal('price', 10, 2);
            $table->integer('available_seats');
            $table->enum('status', ['active', 'cancelled', 'full'])->default('active');
            $table->timestamps();
            
            $table->index(['departure_time', 'status']);
            $table->index(['route_id', 'departure_time']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};