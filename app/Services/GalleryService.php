<?php

namespace App\Services;
use App\Repositories\Interfaces\GalleryRepositoryInterface;

class GalleryService
{
    public function __construct(
        private GalleryRepositoryInterface $repository
    ) {}

    public function getGalleries()
    {
        return $this->repository->getAll();
    }

    public function createGallery(array $data)
    {
        return $this->repository->create($data);
    }

    public function getGalleryBySlug(string $slug)
    {
        return $this->repository->findBySlug($slug);
    }

    public function updateGallery(string $slug, array $data)
    {
        return $this->repository->update($slug, $data);
    }

    public function deleteGallery(int $id)
    {
        return $this->repository->delete($id);
    }
}