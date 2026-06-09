<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateWebsiteSettingsRequest;
use App\Http\Requests\UploadHeroSliderImagesRequest;
use App\Models\ContactModel;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class WebsiteSettingsController extends Controller
{
    private function getContact(): ContactModel
    {
        $contact = ContactModel::first();

        if (!$contact) {
            $contact = ContactModel::create([]);
        }

        return $contact;
    }

    public function index()
    {
        $contact = $this->getContact();

        $sliderImages = $contact->getMedia('hero_slider')->map(fn($media) => [
            'id'  => $media->id,
            'url' => $media->getUrl(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'website_content'    => $contact->website_content,
                'hero_slider_images' => $sliderImages,
            ],
        ]);
    }

    public function update(UpdateWebsiteSettingsRequest $request)
    {
        $contact = $this->getContact();
        $contact->update(['website_content' => $request->validated()['website_content'] ?? null]);

        return response()->json([
            'success' => true,
            'message' => 'Website content updated successfully.',
        ]);
    }

    public function uploadSliderImages(UploadHeroSliderImagesRequest $request)
    {
        $contact = $this->getContact();
        $uploaded = [];

        foreach ($request->file('images') as $image) {
            $media = $contact->addMedia($image)->toMediaCollection('hero_slider');
            $uploaded[] = [
                'id'  => $media->id,
                'url' => $media->getUrl(),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Images uploaded successfully.',
            'data'    => $uploaded,
        ]);
    }

    public function deleteSliderImage(int $mediaId)
    {
        $media = Media::findOrFail($mediaId);
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully.',
        ]);
    }
}
