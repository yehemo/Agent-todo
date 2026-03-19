<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority'    => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'status'      => ['sometimes', Rule::in(['pending', 'in-progress', 'completed'])],
            'due_date'    => ['nullable', 'date'],
            'category_id' => [
                'nullable', 'integer',
                Rule::exists('categories', 'id')
                    ->where('user_id', $this->user()->id)
                    ->whereNull('deleted_at'),
            ],
        ];
    }
}
