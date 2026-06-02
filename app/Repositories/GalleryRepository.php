<?php

namespace App\Repositories;

use App\Models\GalleryModel;
use App\Repositories\Interfaces\GalleryRepositoryInterface; 

class GalleryRepository implements GalleryRepositoryInterface
{
    public function getAll()
    {
        return GalleryModel::with(['category', 'media'])->get();
    }

    public function findById(int $id)
    {
        return GalleryModel::with(['category', 'media'])->findOrFail($id);
    }

    public function create(array $data)
    {
        $image = $data['image'] ?? null;

        unset($data['image']);

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