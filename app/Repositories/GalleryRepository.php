<?php

namespace App\Repositories;

use App\Models\GalleryModel;
use App\Repositories\Interfaces\GalleryRepositoryInterface;
use Illuminate\Support\Str;
use App\Jobs\ProcessGalleryImagesJob;
use Illuminate\Support\Facades\Storage;

class GalleryRepository implements GalleryRepositoryInterface
{
    public function getAll()
    {
        return GalleryModel::with(['category', 'media'])->get();
    }

    public function findBySlug(string $slug)
    {
        return GalleryModel::with(['category', 'coverImage'])->where('slug', $slug)->firstOrFail();
    }

    public function create(array $data)
    {
        $image = $data['cover_image'] ?? null;

        // unset($data['cover_image']);

        if (!isset($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $gallery = GalleryModel::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'gallery_category_id' => $data['gallery_category_id'],
            'status' => 'processing',
            'location' => $data['location'] ?? null,
            'event_date' => $data['event_date'] ?? null,
        ]);

        if ($image) {
            $gallery->addMedia($image)
                ->toMediaCollection('cover_image');
        }

        return $gallery;
    }

    public function update(int $id, array $data)
    {
        $gallery = GalleryModel::findOrFail($id);

        $image = $data['image'] ?? null;

        unset($data['image']);

        if (!isset($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $gallery->update($data);

        if ($image) {
            $gallery->clearMediaCollection('cover_image');

            $gallery->addMedia($image)
                ->toMediaCollection('cover_image');
        }

        return $gallery->fresh()->load('media');
    }

    public function delete(int $id)
    {
        $gallery = GalleryModel::findOrFail($id);

        $gallery->clearMediaCollection('cover_image');

        return $gallery->delete();
    }

    public function addImages(int $id, array $images)
    {
        $gallery = GalleryModel::findOrFail($id);

        $paths = [];

        foreach ($images as $image) {
            $paths[] = $image->store('temp-gallery');
        }

        ProcessGalleryImagesJob::dispatch(
            $id,
            $paths
        );

        return $gallery->fresh()->load('media');
    }
}