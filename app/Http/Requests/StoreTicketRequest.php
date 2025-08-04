<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:Rendah,Sedang,Tinggi',
            'department' => 'required|string|max:255',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx|max:2048',
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
            'title.required' => 'Ticket title is required.',
            'description.required' => 'Problem description is required.',
            'priority.required' => 'Priority level is required.',
            'priority.in' => 'Priority must be one of: Rendah, Sedang, Tinggi.',
            'department.required' => 'Department is required.',
            'attachments.max' => 'You can upload maximum 5 files.',
            'attachments.*.file' => 'Each attachment must be a file.',
            'attachments.*.mimes' => 'Attachments must be: jpeg, png, jpg, gif, pdf, doc, docx.',
            'attachments.*.max' => 'Each file must not exceed 2MB.',
        ];
    }
}