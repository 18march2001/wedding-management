<?php

namespace App\Repositories;

use App\Models\GalleryModel;
use App\Repositories\Interfaces\GalleryRepositoryInterface;
use Illuminate\Support\Str; 

class GalleryRepository implements GalleryRepositoryInterface
{
    public function getAll()
    {
        return GalleryModel::with(['category', 'media'])->get();
    }

    public function findBySlug(string $slug)
    {
        return GalleryModel::with(['category', 'media'])->where('slug', $slug)->firstOrFail();
    }

    public function create(array $data)
    {
        $image = $data['image'] ?? null;

        unset($data['image']);

        if (!isset($data['slug']) && isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $gallery = GalleryModel::create($data);

        if ($image) {
            $gallery->addMedia($image)
                ->toMediaCollection('gallery');
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
            $gallery->clearMediaCollection('gallery');

            $gallery->addMedia($image)
                ->toMediaCollection('gallery');
        }

        return $gallery->fresh()->load('media');;
    }

    public function delete(int $id)
    {
        $gallery = GalleryModel::findOrFail($id);

        $gallery->clearMediaCollection('gallery');

        return $gallery->delete();
    }
}