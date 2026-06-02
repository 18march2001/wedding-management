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

    public function getGalleryById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function updateGallery(int $id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteGallery(int $id)
    {
        return $this->repository->delete($id);
    }
}