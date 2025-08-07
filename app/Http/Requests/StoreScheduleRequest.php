<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'boat_id' => 'required|exists:boats,id',
            'route_id' => 'required|exists:routes,id',
            'departure_time' => 'required|date|after:now',
            'arrival_time' => 'required|date|after:departure_time',
            'price' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,cancelled',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'boat_id.required' => 'Please select a boat.',
            'boat_id.exists' => 'The selected boat is invalid.',
            'route_id.required' => 'Please select a route.',
            'route_id.exists' => 'The selected route is invalid.',
            'departure_time.required' => 'Departure time is required.',
            'departure_time.after' => 'Departure time must be in the future.',
            'arrival_time.required' => 'Arrival time is required.',
            'arrival_time.after' => 'Arrival time must be after departure time.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price must be greater than or equal to 0.',
        ];
    }
}