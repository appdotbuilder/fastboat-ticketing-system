<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'schedule_id' => 'required|exists:schedules,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'passenger_count' => 'required|integer|min:1|max:10',
            'notes' => 'nullable|string|max:500',
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
            'schedule_id.required' => 'Please select a valid schedule.',
            'schedule_id.exists' => 'The selected schedule is invalid.',
            'customer_name.required' => 'Customer name is required.',
            'customer_email.required' => 'Email address is required.',
            'customer_email.email' => 'Please provide a valid email address.',
            'customer_phone.required' => 'Phone number is required.',
            'passenger_count.required' => 'Number of passengers is required.',
            'passenger_count.min' => 'At least 1 passenger is required.',
            'passenger_count.max' => 'Maximum 10 passengers allowed per booking.',
        ];
    }
}