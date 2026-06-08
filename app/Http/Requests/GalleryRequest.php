<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GalleryRequest extends FormRequest
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
        return [
            'title' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('galleries', 'slug')
                    ->ignore($this->route('gallery')),
            ],
            'gallery_category_id' => 'required|exists:gallery_category,id',
            'cover_image' => 'required|mimes:jpg,jpeg,png,webp|image|max:10240',
            'gallery_images' => ['required', 'array'],
            'gallery_images.*' => 'mimes:jpg,jpeg,png,webp|image|max:10240',
            'location' => 'nullable|string|max:255',
            'event_date' => 'nullable|date',
        ];
    }
}
