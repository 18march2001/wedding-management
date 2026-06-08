<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GalleryCategoryRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('gallery_category') ?? $this->route('gallery-category');
        $id = is_object($categoryId) ? $categoryId->id : $categoryId;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('gallery_category', 'name')->ignore($id),
            ],
            'description' => 'nullable|string',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('gallery_category', 'slug')->ignore($id),
            ],
        ];
    }
}
